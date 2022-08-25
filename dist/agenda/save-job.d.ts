import { Agenda } from ".";
import { Job } from "../job";
/**
 * Save the properties on a job to DB
 * @name Agenda#saveJob
 * @function
 * @param job job to save into DB
 * @returns resolves when job is saved or errors
 */
export declare const saveJob: (this: Agenda, job: Job) => Promise<Job>;
//# sourceMappingURL=save-job.d.ts.map