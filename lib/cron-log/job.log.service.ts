import { Job } from "../job";

export enum Direction {
  ASC = "ASC",
  DESC = "DESC",
}

export const PAGE_LIMIT = 20;
export interface Pagination {
  pageNumber: number;
  sortBy: string;
  direction: Direction;
}

export interface JobDetail extends Pagination {
  id: BigInt;
}

export interface JobLogService {
  success: (job: Job) => Promise<void>;
  complete: (job: Job) => Promise<void>;
  fail: (error: any, job: Job) => Promise<void>;
  getJobs: (pagination: Pagination) => Promise<any>;
  getJobLogs: (cronDetail: JobDetail) => Promise<any>;
}
