import { Job, JobAttributesData } from "../job";
import { JobLog } from "./job.log.entity";

export const success = async (job: Job<JobAttributesData>): Promise<void> => {
  const success_log: any = {
    ...job.attrs,
  };
  JobLog.create(success_log);
};
