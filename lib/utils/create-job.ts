import { Agenda } from "../agenda";
import { jobs } from "../agenda/database";
import { Job, JobAttributesData } from "../job";

/**
 * Create Job object from data
 * @param {Object} agenda instance of Agenda
 * @param {Object} jobData job data
 * @returns {Job} returns created job
 */
export const createJob = (agenda: Agenda, jobData: jobs): Job => {
  jobData.agenda = agenda;
  return new Job(jobData);
};
