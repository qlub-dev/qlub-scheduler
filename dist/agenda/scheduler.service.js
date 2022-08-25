"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const _1 = require(".");
const job_log_service_impl_1 = require("../cron-log/job.log.service.impl");
class SchedulerService {
    constructor(param) {
        const { name, db } = param;
        this._agenda = new _1.Agenda({
            name,
            db,
        }, (error) => {
            console.log("Error: ", error);
        });
        this._jobLogService = new job_log_service_impl_1.JobLogServiceImpl(this._agenda._db);
        this._agenda.start();
        this._agenda.on("start", (job) => {
            job_log_service_impl_1.JobLogServiceImpl.start(job);
        });
        this._agenda.on("success", (job) => {
            if (job.agenda._definitions[job.attrs.name].logging)
                job_log_service_impl_1.JobLogServiceImpl.success(job);
        });
        this._agenda.on("fail", (error, job) => {
            if (job.agenda._definitions[job.attrs.name].logging)
                job_log_service_impl_1.JobLogServiceImpl.fail(error, job);
        });
    }
    getScheduler() {
        return this._agenda;
    }
    getJobLogService() {
        return this._jobLogService;
    }
}
exports.SchedulerService = SchedulerService;
//# sourceMappingURL=scheduler.service.js.map