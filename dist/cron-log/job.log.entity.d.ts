import * as Sequelize from "sequelize";
import { Model, Optional } from "sequelize";
export declare enum ResultStatus {
    ERROR = "500",
    SUCCESS = "200"
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
export declare type entityPk = "id";
export declare type entityId = JobLog[entityPk];
export declare type entityOptionalAttributes = "fail_reason" | "cancelled_at";
export declare type entityCreationAttributes = Optional<entityAttributes, entityOptionalAttributes>;
export declare class JobLog extends Model<entityAttributes, entityCreationAttributes> implements entityAttributes {
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
export declare function initModel(sequelize: Sequelize.Sequelize): typeof JobLog;
//# sourceMappingURL=job.log.entity.d.ts.map