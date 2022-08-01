import { Agenda } from ".";
import { Job } from "../job";
import { createJob } from "../utils";
import { jobs } from "./database";

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
export const getJobs = async function (
  this: Agenda,
  query: {},
  sort = ["id", "DESC"],
  limit = 0,
  skip = 0
): Promise<Job[]> {
  const result = await jobs.findAll({
    where: query,
    limit: limit,
    order: sort,
    offset: skip,
  }); // eslint-disable-line;
  return result.map((job: any) => createJob(this, job));
};
