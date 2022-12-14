import { Agenda } from ".";
import createDebugger from "debug";

const debug = createDebugger("agenda:cancel");

/**
 * Cancels any jobs matching the passed DB query, and removes them from the database.
 * @name Agenda#cancel
 * @function
 * @param query DB query to use when cancelling
 * @caller client code, Agenda.purge(), Job.remove()
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cancel = async function (
  this: Agenda,
  query: any
): Promise<number | undefined> {
  debug("attempting to cancel all Agenda jobs", query);
  try {
    const deletedCount = await this.jobs.destroy({ where: query });
    debug("%s jobs cancelled", deletedCount);
    return deletedCount;
  } catch (error) {
    debug("error trying to delete jobs from DB");
    throw error;
  }
};
