import createDebugger from "debug";
import { createJob } from "./create-job";
import { Job, JobAttributesData } from "../job";
import { Agenda } from "../agenda";
import { jobs } from "../agenda/database";
import { Op } from "sequelize";

const debug = createDebugger("agenda:internal:processJobs");

/**
 * Process methods for jobs
 * @param {Job} extraJob job to run immediately
 */
export const processJobs = async function (
  this: Agenda,
  extraJob: Job
): Promise<void> {
  debug(
    "starting to process jobs: [%s:%s]",
    extraJob?.attrs?.name ?? "unknownName",
    extraJob?.attrs?.id ?? "unknownId"
  );
  // Make sure an interval has actually been set
  // Prevents race condition with 'Agenda.stop' and already scheduled run
  if (!this._processInterval) {
    debug("no _processInterval set when calling processJobs, returning");
    return;
  }

  const self = this; // eslint-disable-line @typescript-eslint/no-this-alias
  const definitions = this._definitions;
  const jobQueue = this._jobQueue;
  let jobName;

  // Determine whether or not we have a direct process call!
  if (!extraJob) {
    // Go through each jobName set in 'Agenda.process' and fill the queue with the next jobs
    const parallelJobQueueing = [];
    for (jobName in definitions) {
      if ({}.hasOwnProperty.call(definitions, jobName)) {
        debug("queuing up job to process: [%s]", jobName);
        parallelJobQueueing.push(jobQueueFilling(jobName));
      }
    }

    await Promise.all(parallelJobQueueing);
  } else if (definitions[extraJob.attrs.name]) {
    // Add the job to list of jobs to lock and then lock it immediately!
    debug(
      "job [%s:%s] was passed directly to processJobs(), locking and running immediately",
      extraJob.attrs.name,
      extraJob.attrs.id
    );
    try {
      self._jobsToLock.push(extraJob);
      await lockOnTheFly();
    } finally {
      const index = self._jobsToLock.indexOf(extraJob);
      if (index > -1) {
        self._jobsToLock.splice(index, 1);
      }
    }
  }

  /**
   * Returns true if a job of the specified name can be locked.
   * Considers maximum locked jobs at any time if self._lockLimit is > 0
   * Considers maximum locked jobs of the specified name at any time if jobDefinition.lockLimit is > 0
   * @param name name of job to check if we should lock or not
   * @returns whether or not you should lock job
   */
  function shouldLock(name: string): boolean {
    const jobDefinition = definitions[name];
    let shouldLock = true;
    if (self._lockLimit && self._lockLimit <= self._lockedJobs.length) {
      shouldLock = false;
    }

    if (
      jobDefinition.lockLimit &&
      jobDefinition.lockLimit <= jobDefinition.locked
    ) {
      shouldLock = false;
    }

    debug("job [%s] lock status: shouldLock = %s", name, shouldLock);
    return shouldLock;
  }

  /**
   * Internal method that adds jobs to be processed to the local queue
   * @param jobs Jobs to queue
   */
  function enqueueJob(job: Job) {
    jobQueue.insert(job);
  }

  function dequeueJob(job: Job) {
    jobQueue.remove(job);
  }

  /**
   * Internal method that will lock a job and store it on DB
   * This method is called when we immediately start to process a job without using the process interval
   * We do this because sometimes jobs are scheduled but will be run before the next process time
   */
  async function lockOnTheFly() {
    debug("lockOnTheFly: isLockingOnTheFly: %s", self._isLockingOnTheFly);
    // Already running this? Return
    if (self._isLockingOnTheFly) {
      debug("lockOnTheFly() already running, returning");
      return;
    }

    // Set that we are running this
    self._isLockingOnTheFly = true;

    // Don't have any jobs to run? Return
    if (self._jobsToLock.length === 0) {
      debug("no jobs to current lock on the fly, returning");
      self._isLockingOnTheFly = false;
      return;
    }

    // Grab a job that needs to be locked
    const now = new Date();
    const job = self._jobsToLock.pop();
    if (job === undefined) {
      debug(
        "no job was popped from _jobsToLock, extremely unlikely but not impossible concurrency issue"
      );
      self._isLockingOnTheFly = false;
      return;
    }

    if (self._isJobQueueFilling.has(job.attrs.name)) {
      debug(
        "lockOnTheFly: jobQueueFilling already running for: %s",
        job.attrs.name
      );
      self._isLockingOnTheFly = false;
      return;
    }

    // If locking limits have been hit, stop locking on the fly.
    // Jobs that were waiting to be locked will be picked up during a
    // future locking interval.
    if (!shouldLock(job.attrs.name)) {
      debug("lock limit hit for: [%s:%s]", job.attrs.name, job.attrs.id);
      self._jobsToLock = [];
      self._isLockingOnTheFly = false;
      return;
    }

    // Query to run against collection to see if we need to lock it
    const criteria = {
      id: job.attrs.id,
      lockedAt: null,
      nextRunAt: job.attrs.nextRunAt,
      disabled: { [Op.ne]: true },
    };

    // Update / options for the DB query
    // Lock the job in DB!

    await jobs
      .update({ lockedAt: now }, { where: criteria, returning: true })
      .then(([rowsUpdate, updated]: [any, any]) => {
        if (updated && updated?.length > 0) {
          const job = createJob(self, updated?.[0].toJSON());
          debug(
            "found job [%s:%s] that can be locked on the fly",
            job.attrs.name,
            job.attrs.id
          );
          enqueueJob(job);
          jobProcessing();
        }
      });

    // Mark lock on fly is done for now
    self._isLockingOnTheFly = false;

    // Re-run in case anything is in the queue
    await lockOnTheFly();
  }

  /**
   * Internal method used to fill a queue with jobs that can be run
   * @param {String} name fill a queue with specific job name
   * @returns {undefined}
   */
  async function jobQueueFilling(name: string): Promise<void> {
    debug(
      "jobQueueFilling: %s isJobQueueFilling: %s",
      name,
      self._isJobQueueFilling.has(name)
    );
    self._isJobQueueFilling.set(name, true);

    try {
      // Don't lock because of a limit we have set (lockLimit, etc)
      if (!shouldLock(name)) {
        debug("lock limit reached in queue filling for [%s]", name);
        return; // Goes to finally block
      }

      // Set the date of the next time we are going to run _processEvery function
      self._nextScanAt = new Date(Date.now().valueOf() + self._processEvery);

      // For this job name, find the next job to run and lock it!
      const job = await self._findAndLockNextJob(name, definitions[name]);
      // Still have the job?
      // 1. Add it to lock list
      // 2. Add count of locked jobs
      // 3. Queue the job to actually be run now that it is locked
      // 4. Recursively run this same method we are in to check for more available jobs of same type!
      if (job) {
        // Before en-queueing job make sure we haven't exceed our lock limits
        if (!shouldLock(name)) {
          debug(
            "lock limit reached before job was returned. Releasing lock on [%s]",
            name
          );
          job.attrs.lockedAt = null;
          await self.saveJob(job);
          return;
        }
        debug("[%s:%s] job locked while filling queue", name, job.attrs.id);
        enqueueJob(job);
        jobProcessing();
      }
    } catch (error) {
      debug("[%s] job lock failed while filling queue", name, error);
    } finally {
      self._isJobQueueFilling.delete(name);
    }
  }

  function localLockJob(job: Job) {
    self._lockedJobs.push(job);
    definitions[job.attrs.name].locked++;
  }

  function localUnLockJob(job: Job) {
    const index = self._lockedJobs.indexOf(job);
    if (index > -1) {
      self._lockedJobs.splice(index, 1);
    }
    if (definitions[job.attrs.name].locked > 0) {
      definitions[job.attrs.name].locked--;
    }
  }

  function addRunningJobs(job: Job) {
    self._runningJobs.push(job);
    definitions[job.attrs.name].running++;
  }

  function removeRunningJobs(job: Job) {
    const index = self._runningJobs.indexOf(job);
    if (index > -1) {
      self._runningJobs.splice(index, 1);
    }
    if (definitions[job.attrs.name].running > 0) {
      definitions[job.attrs.name].running--;
    }
  }

  /**
   * Internal method that processes any jobs in the local queue (array)
   * @returns {undefined}
   */
  async function jobProcessing() {
    // Ensure we have jobs
    if (jobQueue.length === 0) {
      return;
    }

    // Store for all sorts of things
    const now = new Date();

    // Get the next job that is not blocked by concurrency
    const job = jobQueue.returnNextConcurrencyFreeJob(definitions);

    dequeueJob(job);
    debug("[%s:%s] about to process job", job.attrs.name, job.attrs.id);
    try {
      localLockJob(job);
      // If the current time is older than the 'nextRunAt' time, run the job
      // Otherwise, setTimeout that gets called at the time of 'nextRunAt'
      if (!job.attrs.nextRunAt || job.attrs.nextRunAt <= now) {
        debug(
          "[%s:%s] nextRunAt is in the past, run the job immediately",
          job.attrs.name,
          job.attrs.id
        );
        await runOrRetry(job);
      }
    } catch (err) {
      debug(`Error while running job: ${job.attrs.name}`);
    } finally {
      localUnLockJob(job);
    }

    /**
     * Internal method that tries to run a job and if it fails, retries again!
     * @returns {undefined}
     */
    async function runOrRetry(job: Job) {
      if (self._processInterval) {
        // @todo: We should check if job exists
        const jobDefinition = definitions[job.attrs.name];
        if (self._runningJobs.length < self._maxConcurrency) {
          // Get the deadline of when the job is not supposed to go past for locking
          const lockDeadline = new Date(
            Date.now() - jobDefinition.lockLifetime
          );

          // This means a job has "expired", as in it has not been "touched" within the lockoutTime
          // Remove from local lock
          // NOTE: Shouldn't we update the 'lockedAt' value in DB so it can be picked up on restart?

          if (job.attrs.lockedAt && job.attrs.lockedAt < lockDeadline) {
            debug(
              "[%s:%s] job lock has expired, freeing it up",
              job.attrs.name,
              job.attrs.id
            );

            // If you have few thousand jobs for one worker it would throw "RangeError: Maximum call stack size exceeded"
            // every 5 minutes (using the default options).
            // We need to utilize the setImmediate() to break the call stack back to 0.
            return;
          }

          try {
            // Add to local "running" queue
            addRunningJobs(job);

            // CALL THE ACTUAL METHOD TO PROCESS THE JOB!!!
            debug("[%s:%s] processing job", job.attrs.name, job.attrs.id);

            await job.run();
          } catch (err) {
            debug(`Error while executing job name: ${job.attrs.name}`);
          } finally {
            removeRunningJobs(job);
          }
        } else {
          // Run the job immediately by putting it on the top of the queue
          debug(
            "[%s:%s] concurrency preventing immediate run, pushing job to top of queue",
            job.attrs.name,
            job.attrs.id
          );
          enqueueJob(job);
        }
      }
    }
  }
};
