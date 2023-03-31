import { Job } from "../job";

export async function isExpired(this: Job): Promise<boolean> {
  const definition = this.agenda._definitions[this.attrs.name];

  const lockDeadline = new Date(Date.now() - definition.lockLifetime);

  // This means a job has "expired", as in it has not been "touched" within the lockoutTime
  // Remove from local lock
  if (this.attrs.lockedAt && this.attrs.lockedAt < lockDeadline) {
    return true;
  }
  return false;
}
