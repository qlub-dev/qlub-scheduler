import { Job } from "../job";

export enum Direction {
  ASC = "ASC",
  DESC = "DESC",
}

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
  fail: (error: any, job: Job) => Promise<void>;
  getCrons: (pagination: Pagination) => Promise<any>;
  getCronLogs: (cronDetail: JobDetail) => Promise<any>;
}
