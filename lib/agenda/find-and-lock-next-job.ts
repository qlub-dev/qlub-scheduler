import createDebugger from "debug";
import { createJob } from "../utils";
import { Agenda } from ".";
import { Job } from "../job";
import { Op } from "sequelize";

const debug = createDebugger("agenda:internal:_findAndLockNextJob");

/**
 * Find and lock jobs
 * @name Agenda#findAndLockNextJob
 * @function
 * @param jobName name of job to try to lock
 * @param definition definition used to tell how job is run
 * @access protected
 * @caller jobQueueFilling() only
 */
export const findAndLockNextJob = async function (
  this: Agenda,
  jobName: string,
  definition: any
): Promise<Job | undefined> {
  const now = new Date();
  const lockDeadline = new Date(Date.now().valueOf() - definition.lockLifetime);
  debug("_findAndLockNextJob(%s, [Function])", jobName);

  const JOB_PROCESS_WHERE_QUERY = {
    [Op.and]: [
      {
        name: jobName,
        disabled: { [Op.ne]: true },
      },
      {
        [Op.or]: [
          {
            lockedAt: null,
            nextRunAt: { [Op.lte]: this._nextScanAt },
          },
          {
            lockedAt: { [Op.lte]: lockDeadline },
          },
        ],
      },
    ],
  };

  /**
   * Query used to set a job as locked
   * @type {{$set: {lockedAt: Date}}}
   */

  /**
   * Query used to affect what gets returned
   * @type {{returnOriginal: boolean, sort: object}}
   */

  // Find ONE and ONLY ONE job and set the 'lockedAt' time so that job begins to be processed
  const updated: any = await this.jobs.findOne({
    where: JOB_PROCESS_WHERE_QUERY,
    useMaster: true,
  });

  if (updated) {
    updated.lockedAt = now;
    await this.jobs.sequelize?.query(`
      UPDATE jobs set "lockedAt" = '${now.toUTCString()}' where id = ${
      updated.id
    }
    `);
    try {
      return createJob(this, updated?.toJSON());
    } finally {
      await this.jobs.sequelize?.query(`
      UPDATE jobs set "lockedAt" = null where id = ${updated.id}
    `);
    }
  }

  return;
};
