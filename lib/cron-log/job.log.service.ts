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
  limit: number;
}

export interface JobDetail extends Pagination {
  id: BigInt;
}

export interface JobLogService {
  getJobs: (pagination: Pagination) => Promise<any>;
  getJobLogs: (cronDetail: JobDetail) => Promise<any>;
}
