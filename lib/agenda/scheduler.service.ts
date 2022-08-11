import { Agenda } from ".";
import { JobLogService } from "../cron-log/job.log.service";
import { JobLogServiceImpl } from "../cron-log/job.log.service.impl";
import { DbConfig } from "./database";

class SchedulerService {
  private _agenda: Agenda | undefined;
  private _jobLogService: JobLogService | undefined;

  constructor(param: { name: string; db: DbConfig }) {
    const { name, db } = param;
    this._agenda = new Agenda(
      {
        name,
        db,
      },
      (error) => {
        console.log("Error: ", error);
      }
    );
    this._jobLogService = new JobLogServiceImpl(this._agenda._db);
    this._agenda.start();
    this._agenda.on("start", (job) => {
      JobLogServiceImpl.start(job);
    });
    this._agenda.on("success", (job) => {
      if (job.agenda._definitions[job.attrs.name].logging)
        JobLogServiceImpl.success(job);
    });
    this._agenda.on("fail", (error, job) => {
      if (job.agenda._definitions[job.attrs.name].logging)
        JobLogServiceImpl.fail(error, job);
    });
  }

  getScheduler() {
    return this._agenda;
  }

  getJobLogService() {
    return this._jobLogService;
  }
}

export { SchedulerService };
