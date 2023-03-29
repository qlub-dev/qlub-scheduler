import debug from "debug";
import { Job, JobAttributesData } from "../job";
import { JobLog, ResultStatus } from "./job.log.entity";

export const success = async (job: Job<JobAttributesData>): Promise<void> => {
  const success_log: any = {
    job_name: job.attrs.name,
    job_id: job.attrs.id,
    job_time: job.attrs.lastFinishedAt,
    job: job.toJSON(),
    result_status: ResultStatus.SUCCESS,
    created_at: new Date(),
  };
  JobLog.create<any>(success_log).catch((error) =>
    debug(`JobLog Success Create Error: ${error}`)
  );
};
