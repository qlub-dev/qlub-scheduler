// module export, beware: cjs.ts is exported as main entry point!
export * from "./agenda";
export * from "./job";

export { DefineOptions, JobPriority, Processor } from "./agenda/define";
export { JobOptions } from "./job/repeat-every";

import { Agenda } from "./agenda";
export { Agenda };

import { SchedulerService } from "./agenda/scheduler.service";
export { SchedulerService };

export default SchedulerService;
