"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveJob = void 0;
const debug_1 = __importDefault(require("debug"));
const utils_1 = require("../utils");
const database_1 = require("./database");
const debug = debug_1.default("agenda:saveJob");
/**
 * Given a result for findOneAndUpdate() or insert() above, determine whether to process
 * the job immediately or to let the processJobs() interval pick it up later
 * @param job job instance
 * @param result the data returned from the findOneAndUpdate() call or insertOne() call
 * @access private
 */
const processDbResult = function (job, result) {
    return __awaiter(this, void 0, void 0, function* () {
        debug("processDbResult() called with success, checking whether to process job immediately or not");
        // We have a result from the above calls
        // findOneAndUpdate() returns different results than insertOne() so check for that
        let attrs = result;
        if (attrs) {
            let nextRunAt;
            if (attrs.id) {
                // find the doc using _id
                const result = yield this.jobs.findOne({
                    where: { id: attrs.id },
                });
                if (result) {
                    nextRunAt = result.dataValues.nextRunAt;
                }
            }
            job.attrs.id = attrs.id;
            job.attrs.nextRunAt = attrs.nextRunAt;
            // Grab ID and nextRunAt from DB and store it as an attribute on Job
            // If the current job would have been processed in an older scan, process the job immediately
            if (job.attrs.nextRunAt && job.attrs.nextRunAt < this._nextScanAt) {
                debug("[%s:%s] job would have ran by nextScanAt, processing the job immediately", job.attrs.name, attrs.id);
                yield utils_1.processJobs.call(this, job);
            }
        }
        // Return the Job instance
        return job;
    });
};
/**
 * Save the properties on a job to DB
 * @name Agenda#saveJob
 * @function
 * @param job job to save into DB
 * @returns resolves when job is saved or errors
 */
const saveJob = function (job) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            debug("attempting to save a job into Agenda instance");
            // Grab information needed to save job but that we don't want to persist in DB
            const id = job.attrs.id;
            const { unique, uniqueOpts } = job.attrs;
            // Store job as JSON and remove props we don't want to store from object
            const props = job.toJSON();
            delete props.id;
            delete props.unique;
            delete props.uniqueOpts;
            props.status = props.status ? props.status : database_1.JobStatus.RUNNING;
            // Store name of agenda queue as last modifier in job data
            props.lastModifiedBy = this._name;
            debug("[job %s] set job props: \n%O", id, props);
            // Grab current time and set default query options for DB
            const now = new Date();
            const protect = {};
            debug("current time stored as %s", now.toISOString());
            // If the job already had an ID, then update the properties of the job
            // i.e, who last modified it, etc
            if (id) {
                // Update the job and process the resulting data'
                debug("job already has _id, calling findOneAndUpdate() using _id as query");
                if (yield this.jobs.findOne({ where: { id } })) {
                    const [_, result] = yield this.jobs
                        .update(props, {
                        where: { id },
                        returning: true,
                    })
                        .catch((error) => {
                        console.log("Job save error occured: ", error);
                        return error;
                    });
                    return yield processDbResult.call(this, job, (_a = result[0]) === null || _a === void 0 ? void 0 : _a.dataValues);
                }
            }
            if (props.type === "single") {
                // Job type set to 'single' so...
                // NOTE: Again, not sure about difference between 'single' here and 'once' in job.js
                debug('job with type of "single" found');
                // If the nextRunAt time is older than the current time, "protect" that property, meaning, don't change
                // a scheduled job's next run time!
                if (props.nextRunAt && props.nextRunAt <= now) {
                    debug("job has a scheduled nextRunAt time, protecting that field from upsert");
                    // @ts-expect-error
                    protect.nextRunAt = props.nextRunAt;
                    delete props.nextRunAt;
                }
                // If we have things to protect, set them in DB using $setOnInsert
                if (Object.keys(protect).length > 0) {
                    props.nextRunAt = protect;
                }
                // Try an upsert
                // NOTE: 'single' again, not exactly sure what it means
                debug('calling findOneAndUpdate() with job name and type of "single" as query');
                if (yield this.jobs.findOne({
                    where: {
                        name: props.name,
                        type: "single",
                    },
                })) {
                    const [_, result] = yield this.jobs
                        .update(props, {
                        where: {
                            name: props.name,
                            type: "single",
                        },
                        returning: true,
                    })
                        .catch((error) => {
                        console.log("Job save error occured: ", error);
                        return error;
                    });
                    return yield processDbResult.call(this, job, (_b = result[0]) === null || _b === void 0 ? void 0 : _b.dataValues);
                }
            }
            if (unique) {
                // If we want the job to be unique, then we can upsert based on the 'unique' query object that was passed in
                const query = job.attrs.unique;
                query.name = props.name;
                // Use the 'unique' query object to find an existing job or create a new one
                debug("calling findOneAndUpdate() with unique object as query: \n%O", query);
                if (yield this.jobs.findOne({
                    where: query,
                })) {
                    const [_, result] = yield this.jobs
                        .update(props, {
                        where: query,
                        returning: true,
                    })
                        .catch((error) => {
                        console.log("Job save error occured: ", error);
                        return error;
                    });
                    return yield processDbResult.call(this, job, (_c = result[0]) === null || _c === void 0 ? void 0 : _c.dataValues);
                }
            }
            // If all else fails, the job does not exist yet so we just insert it into DB
            debug("using default behavior, inserting new job via insertOne() with props that were set: \n%O", props);
            props.status = database_1.JobStatus.RUNNING;
            const result = yield this.jobs.create(props).catch((error) => {
                console.log("Job create error occured: ", error);
                return error;
            });
            return yield processDbResult.call(this, job, result === null || result === void 0 ? void 0 : result.dataValues);
        }
        catch (error) {
            debug("processDbResult() received an error, job was not updated/created");
            throw error;
        }
    });
};
exports.saveJob = saveJob;
//# sourceMappingURL=save-job.js.map