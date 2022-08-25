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
exports.success = void 0;
const job_log_entity_1 = require("./job.log.entity");
const success = (job) => __awaiter(void 0, void 0, void 0, function* () {
    const success_log = {
        job_name: job.attrs.name,
        job_id: job.attrs.id,
        job_time: job.attrs.lastFinishedAt,
        job: job.toJSON(),
        result_status: job_log_entity_1.ResultStatus.SUCCESS,
        created_at: new Date(),
    };
    job_log_entity_1.JobLog.create(success_log).catch((error) => console.log("JobLog Success Create Error: ", error));
});
exports.success = success;
//# sourceMappingURL=success.js.map