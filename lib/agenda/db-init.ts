import createDebugger from "debug";
import { Agenda } from ".";

const debug = createDebugger("agenda:db_init");

/**
 * Setup and initialize the collection used to manage Jobs.
 * @name Agenda#dbInit
 * @function
 * @param collection name or undefined for default 'agendaJobs'
 * @param [cb] called when the db is initialized
 */
export const dbInit = function (
  this: Agenda,
  collection = "jobs",
  cb?: (error: unknown | undefined) => void
): void {
  debug("init database collection using name [%s]", collection);
};
