import { Agenda } from ".";
import createDebugger from "debug";

const debug = createDebugger("agenda:close");

/** Close the db and it's underlying connections
 * Only works if agenda was instantiated without preconfigured DB instance.
 * If the DB instance was supplied during instantiation or via agenda.mongo, this function will do nothing and return agenda anyway.
 * @name Agenda#close
 * @function
 * @param [option] {{ force: boolean }} Force close, emitting no events
 *
 *
 * @caller client code
 *
 */
export const close = async function (
  this: Agenda,
  option?: { force: boolean }
): Promise<Agenda> {
  debug("close db connection for this agenda instance");
  try {
    if (this._db) {
      await this._db.close();
    }

    return this;
  } catch (error) {
    debug("error trying to close db connection to");
    throw error;
  }
};
