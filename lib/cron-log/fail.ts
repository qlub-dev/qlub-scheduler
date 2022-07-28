import { Job, JobAttributesData } from "../job";
import { JobLog } from "./job.log.entity";

export const fail = async (
  error: any,
  job: Job<JobAttributesData>
): Promise<void> => {
  const fail_log: any = {
    ...job.attrs,
  };
  JobLog.create(fail_log);
};
