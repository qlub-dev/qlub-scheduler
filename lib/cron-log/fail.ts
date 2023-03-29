import debug from "debug";
import { Job, JobAttributesData } from "../job";
import { JobLog, ResultStatus } from "./job.log.entity";

export const fail = async (
  reason: string | Error,
  job: Job<JobAttributesData>
): Promise<void> => {
  if (reason instanceof Error) {
    reason = reason.message;
  }
  const fail_log: any = {
    fail_reason: reason,
    job_name: job.attrs.name,
    job_id: job.attrs.id,
    job_time: new Date(),
    job: job.toJSON(),
    result_status: ResultStatus.ERROR,
    created_at: new Date(),
  };
  JobLog.create<any>(fail_log).catch((error) =>
    debug(`JobLog fail create error: ${error}`)
  );
};
