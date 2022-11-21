import { JobLog } from "./job.log.entity";
import { JobLogServiceImpl } from "./job.log.service.impl";

class QJobLog {
  JobLog!: typeof JobLog;
  JobLogService!: typeof JobLogServiceImpl;
}

QJobLog.prototype.JobLog = JobLog;
QJobLog.prototype.JobLogService = JobLogServiceImpl;

export { QJobLog };
