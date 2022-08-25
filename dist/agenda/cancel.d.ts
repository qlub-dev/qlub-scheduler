import { Agenda } from ".";
/**
 * Cancels any jobs matching the passed DB query, and removes them from the database.
 * @name Agenda#cancel
 * @function
 * @param query DB query to use when cancelling
 * @caller client code, Agenda.purge(), Job.remove()
 */
export declare const cancel: (this: Agenda, query: any) => Promise<number | undefined>;
//# sourceMappingURL=cancel.d.ts.map