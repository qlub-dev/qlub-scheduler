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
exports.fail = void 0;
const job_log_entity_1 = require("./job.log.entity");
const fail = (reason, job) => __awaiter(void 0, void 0, void 0, function* () {
    if (reason instanceof Error) {
        reason = reason.message;
    }
    const fail_log = {
        fail_reason: reason,
        job_name: job.attrs.name,
        job_id: job.attrs.id,
        job_time: new Date(),
        job: job.toJSON(),
        result_status: job_log_entity_1.ResultStatus.ERROR,
        created_at: new Date(),
    };
    job_log_entity_1.JobLog.create(fail_log).catch((error) => console.log("JobLog fail create error: ", error));
});
exports.fail = fail;
//# sourceMappingURL=fail.js.map