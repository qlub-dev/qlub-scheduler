import { Sequelize } from "sequelize-typescript";
import { DataTypes } from "sequelize/types";
import { jobs } from "../agenda/database";
import { Job, JobAttributesData } from "../job";
import { JobLog } from "./job.log.entity";
import {
  JobDetail,
  JobLogService,
  PAGE_LIMIT,
  Pagination,
} from "./job.log.service";

export class JobLogServiceImpl implements JobLogService {
  _job_log: typeof JobLog;
  _db: Sequelize;
  constructor(sequelize: Sequelize) {
    this._db = sequelize;
    this._job_log = initModel(this._db);
  }
  async success(job: Job<JobAttributesData>): Promise<void> {
    const success_log: any = {
      ...job.attrs,
    };
    JobLog.create(success_log);
  }
  async complete(job: Job<JobAttributesData>): Promise<void> {
    //TODO implement here
  }
  async fail(error: any, job: Job<JobAttributesData>): Promise<void> {
    const fail_log: any = {
      ...job.attrs,
    };
    JobLog.create(fail_log);
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
