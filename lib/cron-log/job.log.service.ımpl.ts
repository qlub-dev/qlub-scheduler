import { Sequelize } from "sequelize-typescript";
import { DataTypes } from "sequelize/types";
import { jobs } from "../agenda/database";
import { Job, JobAttributesData } from "../job";
import { complete } from "./complete";
import { fail } from "./fail";
import { JobLog } from "./job.log.entity";
import {
  JobDetail,
  JobLogService,
  PAGE_LIMIT,
  Pagination,
} from "./job.log.service";
import { success } from "./success";

export class JobLogServiceImpl implements JobLogService {
  _job_log: typeof JobLog;
  _db: Sequelize;

  static success: typeof success;
  static fail: typeof fail;
  static complete: typeof complete;

  constructor(sequelize: Sequelize) {
    this._db = sequelize;
    this._job_log = initModel(this._db);
  }
  async getJobs(pagination: Pagination): Promise<any> {
    return jobs.findAll({
      attributes: ["id", "agenda", "type"],
      limit: PAGE_LIMIT,
      offset: pagination.pageNumber * PAGE_LIMIT,
      order: [[pagination.sortBy, pagination.direction]],
    });
  }
  async getJobLogs(cronDetail: JobDetail): Promise<any> {
    return JobLog.findAll({
      attributes: ["id", "job_name"],
      where: {
        job_id: cronDetail.id,
      },
      limit: PAGE_LIMIT,
      offset: cronDetail.pageNumber * PAGE_LIMIT,
      order: [[cronDetail.sortBy, cronDetail.direction]],
    });
  }
}

JobLogServiceImpl.success = success;
JobLogServiceImpl.complete = complete;
JobLogServiceImpl.fail = fail;

function initModel(sequelize: Sequelize): typeof JobLog {
  return JobLog.init(
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      job_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      job_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: true,
        references: {
          model: "jobs",
          key: "id",
        },
      },
      job_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: true,
      },
      job: {
        type: DataTypes.JSON,
        defaultValue: true,
      },
      result_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fail_reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cancelled_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "job_log",
      schema: "public",
      timestamps: true,
      indexes: [
        {
          name: "job_log_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
        {
          name: "job_fkey",
          unique: true,
          fields: [{ name: "job_id" }],
        },
      ],
    }
  );
}
