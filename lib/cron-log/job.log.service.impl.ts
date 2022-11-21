import { Sequelize } from "sequelize-typescript";
import { jobs } from "../agenda/database";
import { complete } from "./complete";
import { fail } from "./fail";
import { initModel, JobLog } from "./job.log.entity";
import { JobDetail, JobLogService, PAGE_LIMIT, Pagination } from "./job.log.service";
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
        "createdAt"
      ],
      raw: true,
      limit: PAGE_LIMIT,
      offset: pagination.pageNumber * PAGE_LIMIT,
      order: [[pagination.sortBy, pagination.direction]]
    });
  }

  async getJobLogs(cronDetail: JobDetail): Promise<any> {
    return JobLog.findAll({
      attributes: [
        "id",
        "job_name",
        "result_status",
        "job_time",
        "fail_reason",
        "cancelled_at",
        "createdAt"
      ],
      where: {
        job_id: cronDetail.id
      },
      raw: true,
      limit: PAGE_LIMIT,
      offset: cronDetail.pageNumber * PAGE_LIMIT,
      order: [[cronDetail.sortBy, cronDetail.direction]]
    });
  }
}

JobLogServiceImpl.success = success;
JobLogServiceImpl.complete = complete;
JobLogServiceImpl.fail = fail;
JobLogServiceImpl.start = start;
