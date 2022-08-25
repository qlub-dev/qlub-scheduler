import { Agenda } from ".";
import { Job } from "../job";
/**
 * Finds all jobs matching 'query'
 * @name Agenda#jobs
 * @function
 * @param [query] object for DB
 * @param [sort] object for DB
 * @param [limit] number of documents to return from DB
 * @param [number] of documents to skip in DB
 * @returns resolves when fails or passes
 */
export declare const getJobs: (this: Agenda, query: {}, sort?: string[], limit?: number, skip?: number) => Promise<Job[]>;
//# sourceMappingURL=jobs.d.ts.map