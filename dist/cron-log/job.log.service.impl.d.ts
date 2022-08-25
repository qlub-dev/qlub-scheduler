import { Sequelize } from "sequelize-typescript";
import { complete } from "./complete";
import { fail } from "./fail";
import { JobLog } from "./job.log.entity";
import { JobDetail, JobLogService, Pagination } from "./job.log.service";
import { start } from "./start";
import { success } from "./success";
export declare class JobLogServiceImpl implements JobLogService {
    _job_log: typeof JobLog;
    _db: Sequelize;
    static success: typeof success;
    static fail: typeof fail;
    static complete: typeof complete;
    static start: typeof start;
    constructor(sequelize: Sequelize);
    getJobs(pagination: Pagination): Promise<any>;
    getJobLogs(cronDetail: JobDetail): Promise<any>;
}
//# sourceMappingURL=job.log.service.impl.d.ts.map