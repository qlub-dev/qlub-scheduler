import debug from "debug";
import { Sequelize } from "sequelize-typescript";
import { Agenda, AgendaConfig } from ".";
import { JobLogService } from "../cron-log/job.log.service";
import { JobLogServiceImpl } from "../cron-log/job.log.service.impl";

class SchedulerService {
  private _agenda: Agenda | undefined;
  private _jobLogService: JobLogService | undefined;

  constructor(param: AgendaConfig) {
    const { start } = param;
    this._agenda = new Agenda(param, (error) => {
      debug(`Error while creating instance of agenda err: ${error}`);
    });
    this._jobLogService = new JobLogServiceImpl(this._agenda._db);
    if (!start) return;

    this._agenda.start();
    this._agenda.on("start", (job) => JobLogServiceImpl.start(job));
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
