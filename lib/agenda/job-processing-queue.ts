import { JobDefinition, JobDefinitions } from ".";
import { Job, JobAttributesData } from "../job";

/**
 * @class
 * @param {Object} args - Job Options
 * @property {Object} agenda - The Agenda instance
 * @property {Object} attrs
 */
class JobProcessingQueue {
  pop!: () => Job | undefined;
  push!: (job: Job) => void;
  insert!: (job: Job) => void;
  remove!: (job: Job) => void;
  returnNextConcurrencyFreeJob!: (jobDefinitions: JobDefinitions) => Job;

  protected _queue: Job[];

  constructor() {
    this._queue = [];
  }

  get length(): number {
    return this._queue.length;
  }
}

/**
 * Pops and returns last queue element (next job to be processed) without checking concurrency.
 * @returns Next Job to be processed
 */
JobProcessingQueue.prototype.pop = function (this: JobProcessingQueue) {
  return this._queue.pop();
};

/**
 * Inserts job in first queue position
 * @param job job to add to queue
 */
JobProcessingQueue.prototype.push = function (
  this: JobProcessingQueue,
  job: Job
) {
  this._queue.push(job);
};

/**
 * Inserts job in queue where it will be order from left to right in decreasing
 * order of nextRunAt and priority (in case of same nextRunAt), if all values
 * are even the first jobs to be introduced will have priority
 * @param job job to add to queue
 */
JobProcessingQueue.prototype.insert = function (
  this: JobProcessingQueue,
  job: Job
) {
  const matchIndex = this._queue.findIndex((element) => {
    if (element.attrs.nextRunAt!.getTime() <= job.attrs.nextRunAt!.getTime()) {
      if (
        element.attrs.nextRunAt!.getTime() === job.attrs.nextRunAt!.getTime()
      ) {
        if (element.attrs.priority >= job.attrs.priority) {
          return true;
        }
      } else {
        return true;
      }
    }

    return false;
  });

  if (matchIndex === -1) {
    this._queue.push(job);
  } else {
    this._queue.splice(matchIndex, 0, job);
  }
};

/**
 * Returns (does not pop, element remains in queue) first element (always from the right)
 * that can be processed (not blocked by concurrency execution)
 * @param agendaDefinitions job to add to queue
 * @returns Next Job to be processed
 */
JobProcessingQueue.prototype.returnNextConcurrencyFreeJob = function (
  this: JobProcessingQueue,
  jobDefinitions: JobDefinitions
): Job<JobAttributesData> {
  let next;
  for (next = this._queue.length - 1; next > 0; next -= 1) {
    const def = jobDefinitions[this._queue[next].attrs.name];
    if (def.concurrency > def.running) {
      break;
    }
  }
  return this._queue[next];
};

JobProcessingQueue.prototype.remove = function (
  this: JobProcessingQueue,
  job: Job
): void {
  let removeJobIndex = this._queue.indexOf(job);
  if (removeJobIndex === -1) {
    // lookup by id
    removeJobIndex = this._queue.findIndex((j) => j.attrs.id === job.attrs.id);
  }
  if (removeJobIndex === -1) {
    throw new Error(`cannot find job ${job.attrs.id} in processing queue?`);
  }

  this._queue.splice(removeJobIndex, 1);
};

export { JobProcessingQueue };
