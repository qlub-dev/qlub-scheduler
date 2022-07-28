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
  cancelled_at?: Date | undefined;
  created_at: Date;
  updated_at: Date;
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
  created_at!: Date;
  updated_at!: Date;
}
