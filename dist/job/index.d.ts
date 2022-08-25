import { toJson } from "./to-json";
import { computeNextRunAt } from "./compute-next-run-at";
import { repeatEvery } from "./repeat-every";
import { repeatAt } from "./repeat-at";
import { disable } from "./disable";
import { enable } from "./enable";
import { unique } from "./unique";
import { schedule } from "./schedule";
import { priority } from "./priority";
import { fail } from "./fail";
import { run } from "./run";
import { isRunning } from "./is-running";
import { save } from "./save";
import { remove } from "./remove";
import { touch } from "./touch";
import { setShouldSaveResult } from "./set-shouldsaveresult";
import { Agenda } from "../agenda";
export interface JobAttributesData {
    [key: string]: any;
}
/**
 * @class
 * @param {Object} args - Job Options
 * @property {Object} agenda - The Agenda instance
 * @property {Object} attrs
 */
declare class Job<T extends JobAttributesData = JobAttributesData> {
    /**
     * The agenda that created the job.
     */
    agenda: Agenda;
    /**
     * The database record associated with the job.
     */
    attrs: JobAttributesData;
    toJSON: typeof toJson;
    computeNextRunAt: typeof computeNextRunAt;
    repeatEvery: typeof repeatEvery;
    repeatAt: typeof repeatAt;
    disable: typeof disable;
    enable: typeof enable;
    unique: typeof unique;
    schedule: typeof schedule;
    priority: typeof priority;
    fail: typeof fail;
    run: typeof run;
    isRunning: typeof isRunning;
    save: typeof save;
    remove: typeof remove;
    touch: typeof touch;
    setShouldSaveResult: typeof setShouldSaveResult;
    constructor(options: any);
}
export { Job };
//# sourceMappingURL=index.d.ts.map