import { Agenda } from ".";
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
export declare const close: (this: Agenda, option?: {
    force: boolean;
} | undefined) => Promise<Agenda>;
//# sourceMappingURL=close.d.ts.map