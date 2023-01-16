import { Sequelize } from "sequelize-typescript";
import { jobs } from "../agenda/database";
import { complete } from "./complete";
import { fail } from "./fail";
import { initModel, JobLog } from "./job.log.entity";
import {
  JobDetail,
  JobLogService,
  PAGE_LIMIT,
  Pagination,
} from "./job.log.service";
import { start } from "./start";
import { success } from "./success";

export class JobLogServiceImpl implements JobLogService {
  static success: typeof success;
  static fail: typeof fail;
  static complete: typeof complete;
  static start: typeof start;
  _job_log: typeof JobLog;
  _db: Sequelize;

  constructor(sequelize: Sequelize) {
    this._db = sequelize;
    this._job_log = initModel(this._db);
  }

  async getJobs(pagination: Pagination): Promise<any> {
    const { limit, pageNumber, sortBy, direction } = pagination;
    return jobs.findAll({
      attributes: [
        "id",
        "name",
        "type",
        "status",
        "repeatInterval",
        "repeatTimezone",
        "lastRunAt",
        "lastFinishedAt",
        "createdAt",
      ],
      raw: true,
      limit: limit ?? PAGE_LIMIT,
      offset: pageNumber * PAGE_LIMIT,
      order: [[sortBy, direction]],
    });
  }

  async getJobLogs(cronDetail: JobDetail): Promise<any> {
    const { limit, pageNumber, sortBy, direction, id } = cronDetail;
    return JobLog.findAll({
      attributes: [
        "id",
        "job_name",
        "result_status",
        "job_time",
        "fail_reason",
        "cancelled_at",
        "createdAt",
      ],
      where: {
        job_id: id,
      },
      raw: true,
      limit: limit ?? PAGE_LIMIT,
      offset: pageNumber * PAGE_LIMIT,
      order: [[sortBy, direction]],
    });
  }
}

JobLogServiceImpl.success = success;
JobLogServiceImpl.complete = complete;
JobLogServiceImpl.fail = fail;
JobLogServiceImpl.start = start;
