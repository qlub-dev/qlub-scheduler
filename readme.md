### QLUB-SCHEDULER
```
import { SchedulerService } from 'agenda';
import { Direction } from 'agenda/dist/cron-log/job.log.service';
function time() {
  return new Date().toTimeString().split(' ')[0];
}

export default async function CronJob() {
  const scheduler = SchedulerService.instanciateScheduler('qlub', {
    dbName: 'local-cron',
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
  });

  scheduler.define(
    'qlub notification cron',
    {
      concurrency: 3,
      lockLifetime: 5 * 100,
      priority: 10,
      shouldSaveResult: true,
    },
    async (job, done) => {
      console.log('SUCCESS: >>>>>>>>> ', job.attrs.name, ',now: ', new Date(), ', nextRunTime: ', job.attrs.nextRunAt);
      const jobs = await SchedulerService.getJobLogService().getJobs({
        pageNumber: 0,
        sortBy: 'id',
        direction: Direction.ASC,
      });
      console.log('JOB: ', jobs[0].dataValues.status);

      const job_log = await SchedulerService.getJobLogService().getJobLogs({
        id: BigInt(1),
        pageNumber: 0,
        sortBy: 'id',
        direction: Direction.ASC,
      });
      job_log.forEach((log) => {
        console.log('JOB_LOG: ', log.dataValues);
      });

      done();
    },
  );

  await scheduler.start();
  await scheduler.every('* * * * * *', 'qlub notification cron');
}


### The output should be like this:
# 17:44:39 Job <test cron> starting
# SUCCESS: >>>>>>>>>  test cron ,now:  2022-07-27T14:44:39.419Z , nextRunTime:  2022-07-27T14:44:40.000Z
# 17:44:39 Job <test cron> succeeded

