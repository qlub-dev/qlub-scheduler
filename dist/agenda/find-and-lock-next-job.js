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
exports.findAndLockNextJob = void 0;
const debug_1 = __importDefault(require("debug"));
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
const debug = debug_1.default("agenda:internal:_findAndLockNextJob");
/**
 * Find and lock jobs
 * @name Agenda#findAndLockNextJob
 * @function
 * @param jobName name of job to try to lock
 * @param definition definition used to tell how job is run
 * @access protected
 * @caller jobQueueFilling() only
 */
const findAndLockNextJob = function (jobName, definition) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const lockDeadline = new Date(Date.now().valueOf() - definition.lockLifetime);
        debug("_findAndLockNextJob(%s, [Function])", jobName);
        const JOB_PROCESS_WHERE_QUERY = {
            [sequelize_1.Op.and]: [
                {
                    name: jobName,
                    disabled: { [sequelize_1.Op.ne]: true },
                },
                {
                    [sequelize_1.Op.or]: [
                        {
                            lockedAt: { [sequelize_1.Op.eq]: null },
                            nextRunAt: { [sequelize_1.Op.lte]: this._nextScanAt },
                        },
                        {
                            lockedAt: { [sequelize_1.Op.lte]: lockDeadline },
                        },
                    ],
                },
            ],
        };
        /**
         * Query used to set a job as locked
         * @type {{$set: {lockedAt: Date}}}
         */
        /**
         * Query used to affect what gets returned
         * @type {{returnOriginal: boolean, sort: object}}
         */
        // Find ONE and ONLY ONE job and set the 'lockedAt' time so that job begins to be processed
        let updated = yield this.jobs.findOne({
            where: JOB_PROCESS_WHERE_QUERY,
        });
        let job;
        if (updated) {
            updated.lockedAt = now;
            this.jobs.update(updated, { where: { name: jobName } });
            job = utils_1.createJob(this, updated === null || updated === void 0 ? void 0 : updated.dataValues);
        }
        // @ts-ignore
        return job;
    });
};
exports.findAndLockNextJob = findAndLockNextJob;
//# sourceMappingURL=find-and-lock-next-job.js.map