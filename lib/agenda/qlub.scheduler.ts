import { Agenda } from ".";
import { JobLogService } from "../cron-log/job.log.service";
import { JobLogServiceImpl } from "../cron-log/job.log.service.ımpl";
import { DbConfig } from "./database";

class QlubSchedulerService {
  private static _agenda: Agenda;
  private static _jobLogService: JobLogService;
  private constructor() {}

  instanciateScheduler(name: string, db: DbConfig) {
    QlubSchedulerService._agenda = new Agenda(
      {
        name,
        db,
      },
      (error) => {
        console.log("Error: ", error);
      }
    );
    QlubSchedulerService._jobLogService = new JobLogServiceImpl(
      QlubSchedulerService._agenda._db
    );
    QlubSchedulerService._agenda.start();
  }
  getScheduler() {
    return QlubSchedulerService._agenda;
  }

  getJobLogService() {
    return QlubSchedulerService._jobLogService;
  }
}

export { QlubSchedulerService };
