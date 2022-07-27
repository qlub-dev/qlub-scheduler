import createDebugger from "debug";
import { Op } from "sequelize";
import { Agenda } from ".";

const debug = createDebugger("agenda:stop");

/**
 * Clear the interval that processes the jobs
 * @name Agenda#stop
 * @function
 * @returns resolves when job unlocking fails or passes
 */
export const stop = async function (this: Agenda): Promise<void> {
  /**
   * Internal method to unlock jobs so that they can be re-run
   * NOTE: May need to update what properties get set here, since job unlocking seems to fail
   * @access private
   * @returns resolves when job unlocking fails or passes
   */
  const _unlockJobs = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      debug("Agenda._unlockJobs()");
      const jobIds = this._lockedJobs.map((job) => job.attrs.id);

      if (jobIds.length === 0) {
        debug("no jobs to unlock");
        resolve();
      }

      debug("about to unlock jobs with ids: %O", jobIds);
      try {
        this.jobs.update(
          { lockedAt: null },
          { where: { id: { [Op.in]: jobIds } } }
        );
      } catch (error) {
        if (error) {
          reject(error);
        }
        this._lockedJobs = [];
        resolve();
      }
    });
  };

  debug("Agenda.stop called, clearing interval for processJobs()");
  clearInterval(this._processInterval);
  this._processInterval = undefined;
  return _unlockJobs();
};
