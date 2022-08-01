import createDebugger from "debug";
import { Agenda } from ".";
const debug = createDebugger("agenda:disable");

/**
 * Disables any jobs matching the passed DB query by setting the `disabled` flag to `true`
 * @name Agenda#disable
 * @function
 * @param query DB query to use when enabling
 * @returns {Promise<number>} Resolved with the number of disabled job instances.
 */
export const disable = async function (
  this: Agenda,
  query: {}
): Promise<number> {
  debug("attempting to disable all jobs matching query", query);
  try {
    const [affectedCount] = await this.jobs.update(
      { disabled: true },
      { where: query }
    );
    debug("%s jobs disabled");
    return affectedCount;
  } catch (error) {
    debug("error trying to mark jobs as `disabled`");
    throw error;
  }
};
