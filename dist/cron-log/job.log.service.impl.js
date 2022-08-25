"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobLogServiceImpl = void 0;
const database_1 = require("../agenda/database");
const complete_1 = require("./complete");
const fail_1 = require("./fail");
const job_log_entity_1 = require("./job.log.entity");
const job_log_service_1 = require("./job.log.service");
const start_1 = require("./start");
const success_1 = require("./success");
class JobLogServiceImpl {
    constructor(sequelize) {
        this._db = sequelize;
        this._job_log = (0, job_log_entity_1.initModel)(this._db);
    }
    getJobs(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.jobs.findAll({
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
                limit: job_log_service_1.PAGE_LIMIT,
                offset: pagination.pageNumber * job_log_service_1.PAGE_LIMIT,
                order: [[pagination.sortBy, pagination.direction]],
            });
        });
    }
    getJobLogs(cronDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            return job_log_entity_1.JobLog.findAll({
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
                    job_id: cronDetail.id,
                },
                raw: true,
                limit: job_log_service_1.PAGE_LIMIT,
                offset: cronDetail.pageNumber * job_log_service_1.PAGE_LIMIT,
                order: [[cronDetail.sortBy, cronDetail.direction]],
            });
        });
    }
}
exports.JobLogServiceImpl = JobLogServiceImpl;
JobLogServiceImpl.success = success_1.success;
JobLogServiceImpl.complete = complete_1.complete;
JobLogServiceImpl.fail = fail_1.fail;
JobLogServiceImpl.start = start_1.start;
//# sourceMappingURL=job.log.service.impl.js.map