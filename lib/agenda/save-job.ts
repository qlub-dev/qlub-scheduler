import createDebugger from "debug";
import { Op } from "sequelize";
import { Agenda } from ".";
import { Job } from "../job";
import { processJobs } from "../utils";
import { JobStatus } from "./database";

const debug = createDebugger("agenda:saveJob");

/**
 * Given a result for findOneAndUpdate() or insert() above, determine whether to process
 * the job immediately or to let the processJobs() interval pick it up later
 * @param job job instance
 * @param result the data returned from the findOneAndUpdate() call or insertOne() call
 * @access private
 */
const processDbResult = async function (
  this: Agenda,
  job: Job,
  result: any | any[]
) {
  debug(
    "processDbResult() called with success, checking whether to process job immediately or not"
  );

  // We have a result from the above calls
  // findOneAndUpdate() returns different results than insertOne() so check for that
  let attrs = result;
  if (attrs) {
    let nextRunAt: Date | null | undefined;

    if (attrs.id) {
      // find the doc using _id
      const result: any = await this.jobs.findOne({
        where: { id: attrs.id },
        useMaster: true,
      });

      if (result) {
        nextRunAt = result.dataValues.nextRunAt;
      }
    }
    job.attrs.id = attrs.id;
    job.attrs.nextRunAt = attrs.nextRunAt;
    // Grab ID and nextRunAt from DB and store it as an attribute on Job

    // If the current job would have been processed in an older scan, process the job immediately
    if (job.attrs.nextRunAt && job.attrs.nextRunAt < this._nextScanAt) {
      debug(
        "[%s:%s] job would have ran by nextScanAt, processing the job immediately",
        job.attrs.name,
        attrs.id
      );
      await processJobs.call(this, job);
    }
  }

  // Return the Job instance
  return job;
};

/**
 * Save the properties on a job to DB
 * @name Agenda#saveJob
 * @function
 * @param job job to save into DB
 * @returns resolves when job is saved or errors
 */
export const saveJob = async function (this: Agenda, job: Job): Promise<Job> {
  try {
    debug("attempting to save a job into Agenda instance");

    // Grab information needed to save job but that we don't want to persist in DB
    const id = job.attrs.id;
    const { unique } = job.attrs;

    // Store job as JSON and remove props we don't want to store from object
    const props = job.toJSON();
    delete props.id;
    delete props.unique;
    delete props.uniqueOpts;
    props.status = props.status ? props.status : JobStatus.RUNNING;

    // Store name of agenda queue as last modifier in job data
    props.lastModifiedBy = this._name;
    debug("[job %s] set job props: \n%O", id, props);

    // Grab current time and set default query options for DB
    const now = new Date();
    const protect = {};
    debug("current time stored as %s", now.toISOString());

    // If the job already had an ID, then update the properties of the job
    // i.e, who last modified it, etc
    if (id) {
      // Update the job and process the resulting data'
      debug(
        "job already has _id, calling findOneAndUpdate() using _id as query"
      );
      const [_, result]: [number, any] = await this.jobs
        .update(props, {
          where: { id },
          returning: true,
        })
        .catch((error) => {
          debug("Job save error occurred: ");
          return error;
        });
      return await processDbResult.call(this, job, result?.[0]?.toJSON());
    }

    if (props.type === "single") {
      // Job type set to 'single' so...
      // NOTE: Again, not sure about difference between 'single' here and 'once' in job.js
      debug('job with type of "single" found');

      // If the nextRunAt time is older than the current time, "protect" that property, meaning, don't change
      // a scheduled job's next run time!
      if (props.nextRunAt && props.nextRunAt <= now) {
        debug(
          "job has a scheduled nextRunAt time, protecting that field from upsert"
        );
        // @ts-expect-error
        protect.nextRunAt = props.nextRunAt;
        delete props.nextRunAt;
      }

      // If we have things to protect, set them in DB using $setOnInsert
      if (Object.keys(protect).length > 0) {
        props.nextRunAt = protect;
      }

      // Try an upsert
      // NOTE: 'single' again, not exactly sure what it means
      debug(
        'calling findOneAndUpdate() with job name and type of "single" as query'
      );
      const _job = await this.jobs.findOne({
        where: {
          name: props.name,
          type: "single",
        },
        useMaster: true,
      });

      if (_job) {
        const [_, result]: [number, any] = await this.jobs
          .update(props, {
            where: {
              id: _job.id,
            },
            returning: true,
          })
          .catch((error) => {
            debug("Job save error occurred: ", error);
            return error;
          });
        this.jobs.update(
          { disabled: true },
          { where: { name: _job.name, id: { [Op.ne]: _job.id } } }
        );
        return await processDbResult.call(this, job, result?.[0]?.toJSON());
      }
    }

    if (unique) {
      // If we want the job to be unique, then we can upsert based on the 'unique' query object that was passed in
      const query = job.attrs.unique;
      query.name = props.name;
      // Use the 'unique' query object to find an existing job or create a new one
      debug(
        "calling findOneAndUpdate() with unique object as query: \n%O",
        query
      );
      if (
        await this.jobs.findOne({
          where: query,
          useMaster: true,
        })
      ) {
        const [_, result]: [any, any] = await this.jobs
          .update(props, {
            where: query,
            returning: true,
          })
          .catch((error) => {
            debug("Job save error occurred: ", error);
            return error;
          });
        return await processDbResult.call(this, job, result[0]?.dataValues);
      }
    }

    // If all else fails, the job does not exist yet so we just insert it into DB
    debug(
      "using default behavior, inserting new job via insertOne() with props that were set: \n%O",
      props
    );
    props.status = JobStatus.RUNNING;
    const result = await this.jobs.create<any>(props).catch((error) => {
      debug("Job create error occurred: ", error);
      return error;
    });
    return await processDbResult.call(this, job, result?.toJSON());
  } catch (error) {
    debug("processDbResult() received an error, job was not updated/created");
    throw error;
  }
};
