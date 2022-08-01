import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export enum ResultStatus {
  ERROR = "500",
  SUCCESS = "200",
}
export interface entityAttributes {
  id: BigInt;
  job_name: string;
  job_id: BigInt;
  job_time: Date;
  job: JSON;
  result_status: string;
  fail_reason?: string | undefined;
  cancelled_at?: Date | undefined;
  createdAt: Date;
  updatedAt?: Date;
}

export type entityPk = "id";
export type entityId = JobLog[entityPk];
export type entityOptionalAttributes = "fail_reason" | "cancelled_at";
export type entityCreationAttributes = Optional<
  entityAttributes,
  entityOptionalAttributes
>;

export class JobLog
  extends Model<entityAttributes, entityCreationAttributes>
  implements entityAttributes
{
  id!: BigInt;
  job_name!: string;
  job_id!: BigInt;
  job_time!: Date;
  job!: JSON;
  result_status!: string;
  fail_reason?: string | undefined;
  cancelled_at?: Date | undefined;
  createdAt!: Date;
  updatedAt?: Date;
}

export function initModel(sequelize: Sequelize.Sequelize): typeof JobLog {
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
        allowNull: false,
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
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
