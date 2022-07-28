import { QlubSchedulerService } from "scheduler";
function time() {
  return new Date().toTimeString().split(" ")[0];
}

export default async function CronJob() {
  const scheduler = QlubSchedulerService.instanciateScheduler({
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
