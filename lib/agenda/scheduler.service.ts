import { Agenda } from ".";
import { JobLogService } from "../cron-log/job.log.service";
import { JobLogServiceImpl } from "../cron-log/job.log.service.impl";
import { DbConfig } from "./database";

class SchedulerService {
  private static _agenda: Agenda;
  private static _jobLogService: JobLogService;
  private constructor() {}

  static instanciateScheduler(name: string, db: DbConfig): Agenda {
    if (SchedulerService._agenda) return SchedulerService._agenda;
    SchedulerService._agenda = new Agenda(
      {
        name,
        db,
      },
      (error) => {
        console.log("Error: ", error);
      }
    );
    SchedulerService._jobLogService = new JobLogServiceImpl(
      SchedulerService._agenda._db
    );
    SchedulerService._agenda.start();
    SchedulerService._agenda.on("start", (job) => {
      JobLogServiceImpl.start(job);
    });
    SchedulerService._agenda.on("success", (job) => {
      JobLogServiceImpl.success(job);
    });
    SchedulerService._agenda.on("fail", (error, job) => {
      JobLogServiceImpl.fail(error, job);
    });
    return SchedulerService._agenda;
  }

  static getScheduler() {
    return SchedulerService._agenda;
  }

  static getJobLogService() {
    return SchedulerService._jobLogService;
  }
}

export { SchedulerService };
