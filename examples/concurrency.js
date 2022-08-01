import { SchedulerService } from "agenda";
function time() {
  return new Date().toTimeString().split(" ")[0];
}

export default async function CronJob() {
  const scheduler = SchedulerService.instanciateScheduler({
    name: "qlub",
    db: {
      dbName: "local-cron",
      user: "postgres",
      password: "password",
      host: "localhost",
      port: 5432,
      dialect: "postgres",
    },
  });

  scheduler.define(
    "qlub notification cron",
    {
      concurrency: 3,
      lockLifetime: 5 * 100,
      priority: 10,
      shouldSaveResult: true,
    },
    async (job, done) => {
      console.log(
        "SUCCESS: >>>>>>>>> ",
        job.attrs.name,
        ",now: ",
        new Date(),
        ", nextRunTime: ",
        job.attrs.nextRunAt
      );
      done();
    }
  );

  await scheduler.start();
  await scheduler.every("* * * * * *", "test cron");

  scheduler.on("ready", () => {
    console.log("ready");
  });
  scheduler.on("start", (job) => {
    console.log(time(), `Job <${job.attrs.name}> starting`);
  });
  scheduler.on("success", (job) => {
    console.log(time(), `Job <${job.attrs.name}> succeeded`);
  });
  scheduler.on("fail", (error, job) => {
    console.log(time(), `Job <${job.attrs.name}> failed:`, error);
  });
}
