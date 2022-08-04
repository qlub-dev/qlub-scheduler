import { Agenda } from ".";
import { JobLogService } from "../cron-log/job.log.service";
import { JobLogServiceImpl } from "../cron-log/job.log.service.impl";
import { DbConfig } from "./database";

class SchedulerService {
  private static _agenda: Agenda;
  private static _jobLogService: JobLogService;
  public constructor() {}

  static instanciateScheduler(param: { name: string; db: DbConfig }): Agenda {
    const { name, db } = param;
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
      if (job.agenda._definitions[job.attrs.name].logging)
        JobLogServiceImpl.success(job);
    });
    SchedulerService._agenda.on("fail", (error, job) => {
      if (job.agenda._definitions[job.attrs.name].logging)
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
