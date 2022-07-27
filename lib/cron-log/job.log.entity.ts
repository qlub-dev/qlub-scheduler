import { Sequelize } from "sequelize-typescript";
import { DataTypes, Model, Optional } from "sequelize/types";

export interface entityAttributes {
  id: BigInt;
  job_name: string;
  job_id: BigInt;
  job_time: Date;
  job: JSON;
  result_status: string;
  fail_reason?: string | undefined;
  created_at: Date;
  updated_at: Date;
}

export type entityPk = "id";
export type entityId = job_log[entityPk];
export type entityOptionalAttributes = "fail_reason";
export type entityCreationAttributes = Optional<
  entityAttributes,
  entityOptionalAttributes
>;

export class job_log
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
  created_at!: Date;
  updated_at!: Date;
}

function initModel(sequelize: Sequelize): typeof job_log {
  return job_log.init(
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
      ],
    }
  );
}
