import { Agenda } from "../agenda";
import { Job, JobAttributesData } from "../job";

/**
 * Create Job object from data
 * @param {Object} agenda instance of Agenda
 * @param {Object} jobData job data
 * @returns {Job} returns created job
 */
export const createJob = (agenda: Agenda, jobData: JobAttributesData): Job => {
  jobData.agenda = agenda;
  return new Job(jobData);
};
