### QLUB-SCHEDULER
```
import { Agenda, JobPriority } from "agenda";
const agenda = new Agenda(
  {
    name: "qlub",
    db: {
      dbName: "local-cron",
      user: "postgres",
      password: "password",
      host: "localhost",
      port: 5432,
      dialect: "postgres",
    },
  },
  (error) => {
    console.log("Error: ", error);
  }
);

agenda.define(
  "test cron",
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

function time() {
  return new Date().toTimeString().split(" ")[0];
}

export default async function CronJob() {
  await agenda.start();
  await agenda.every("* * * * * *", "test cron");

  agenda.on("start", (job) => {
    console.log(time(), `Job <${job.attrs.name}> starting`);
  });
  agenda.on("success", (job) => {
    console.log(time(), `Job <${job.attrs.name}> succeeded`);
  });
  agenda.on("fail", (error, job) => {
    console.log(time(), `Job <${job.attrs.name}> failed:`, error);
  });
}

### The output should be like this:
# 17:44:39 Job <test cron> starting
# SUCCESS: >>>>>>>>>  test cron ,now:  2022-07-27T14:44:39.419Z , nextRunTime:  2022-07-27T14:44:40.000Z
# 17:44:39 Job <test cron> succeeded

