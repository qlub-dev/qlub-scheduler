import { Agenda } from ".";
/**
 * Disables any jobs matching the passed DB query by setting the `disabled` flag to `true`
 * @name Agenda#disable
 * @function
 * @param query DB query to use when enabling
 * @returns {Promise<number>} Resolved with the number of disabled job instances.
 */
export declare const disable: (this: Agenda, query: {}) => Promise<number>;
//# sourceMappingURL=disable.d.ts.map