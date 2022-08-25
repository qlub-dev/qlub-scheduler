import { Agenda } from ".";
import { JobLogService } from "../cron-log/job.log.service";
import { DbConfig } from "./database";
declare class SchedulerService {
    private _agenda;
    private _jobLogService;
    constructor(param: {
        name: string;
        db: DbConfig;
    });
    getScheduler(): Agenda | undefined;
    getJobLogService(): JobLogService | undefined;
}
export { SchedulerService };
//# sourceMappingURL=scheduler.service.d.ts.map