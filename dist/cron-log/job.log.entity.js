"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModel = exports.JobLog = exports.ResultStatus = void 0;
const sequelize_1 = require("sequelize");
var ResultStatus;
(function (ResultStatus) {
    ResultStatus["ERROR"] = "500";
    ResultStatus["SUCCESS"] = "200";
})(ResultStatus = exports.ResultStatus || (exports.ResultStatus = {}));
class JobLog extends sequelize_1.Model {
}
exports.JobLog = JobLog;
function initModel(sequelize) {
    return JobLog.init({
        id: {
            autoIncrement: true,
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
        },
        job_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        job_id: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: true,
            references: {
                model: "jobs",
                key: "id",
            },
        },
        job_time: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: true,
        },
        job: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: true,
        },
        result_status: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        fail_reason: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        cancelled_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
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
    });
}
exports.initModel = initModel;
//# sourceMappingURL=job.log.entity.js.map