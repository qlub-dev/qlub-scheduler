import createDebugger from "debug";
import { Job } from ".";
import { JobStatus } from "../agenda/database";

const debug = createDebugger("agenda:job");

/**
 * Fails the job with a reason (error) specified
 * @name Job#fail
 * @function
 * @param reason reason job failed
 */
export const fail = function (this: Job, reason: string | Error): Job {
  if (reason instanceof Error) {
    reason = reason.message;
  }

  this.attrs.status = JobStatus.FAILED;
  this.attrs.failReason = reason;
  this.attrs.failCount = Number(this.attrs.failCount || 0) + 1;
  const now = new Date();
  this.attrs.failedAt = now;
  this.attrs.lastFinishedAt = now;
  debug(
    "[%s:%s] fail() called [%d] times so far",
    this.attrs.name,
    this.attrs.id,
    this.attrs.failCount
  );
  return this;
};
