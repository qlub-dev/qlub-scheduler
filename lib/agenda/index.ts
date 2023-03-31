import { EventEmitter } from "events";
import humanInterval from "human-interval";
import { Sequelize } from "sequelize-typescript";
import { JobLog } from "../cron-log";
import { JobLogService } from "../cron-log/job.log.service";
import { Job } from "../job";
import { repeatAt } from "../job/repeat-at";
import { cancel } from "./cancel";
import { create } from "./create";
import { database, jobs } from "./database";
import { dbInit } from "./db-init";
import { defaultConcurrency } from "./default-concurrency";
import { defaultLockLifetime } from "./default-lock-lifetime";
import { defaultLockLimit } from "./default-lock-limit";
import { define, Processor } from "./define";
import { disable } from "./disable";
import { enable } from "./enable";
import { every } from "./every";
import { findAndLockNextJob } from "./find-and-lock-next-job";
import { JobProcessingQueue } from "./job-processing-queue";
import { lockLimit } from "./lock-limit";
import { maxConcurrency } from "./max-concurrency";
import { name } from "./name";
import { now } from "./now";
import { processEvery } from "./process-every";
import { purge } from "./purge";
import { saveJob } from "./save-job";
import { schedule } from "./schedule";
import { sort } from "./sort";
import { start } from "./start";
import { stop } from "./stop";

export interface AgendaConfig {
  start: boolean;
  name?: string;
  processEvery?: string;
  maxConcurrency?: number;
  defaultConcurrency?: number;
  lockLimit?: number;
  defaultLockLimit?: number;
  defaultLockLifetime?: number;
  sort?: any;
  db: Sequelize;
  disableAutoIndex?: boolean;
}

export interface JobDefinition {
  blocked?: number;
  fn: (...args: any[]) => any;
  locked: number;
  lockLimit: number;
  concurrency: number;
  running: number;
  lockLifetime: number;
  priority: number;
  shouldSaveResult: boolean;
  logging: boolean | undefined;
}

/**
 * @class Agenda
 * @param {Object} config - Agenda Config
 * @param {Function} cb - Callback after Agenda has started and connected to mongo
 * @property {Object} _name - Name of the current Agenda queue
 * @property {Number} _processEvery
 * @property {Number} _defaultConcurrency
 * @property {Number} _maxConcurrency
 * @property {Number} _defaultLockLimit
 * @property {Number} _lockLimit
 * @property {Object} _definitions
 * @property {Object} _runningJobs
 * @property {Object} _lockedJobs
 * @property {Object} _jobQueue
 * @property {Number} _defaultLockLifetime
 * @property {Object} _sort
 * @property {Object} _indices
 * @property {Boolean} _isLockingOnTheFly - true if 'lockingOnTheFly' is currently running. Prevent concurrent execution of this method.
 * @property {Map} _isJobQueueFilling - A map of jobQueues and if the 'jobQueueFilling' method is currently running for a given map. 'lockingOnTheFly' and 'jobQueueFilling' should not run concurrently for the same jobQueue. It can cause that lock limits aren't honored.
 * @property {Array} _jobsToLock
 */

export type JobDefinitions = { [name: string]: JobDefinition };
class Agenda extends EventEmitter {
  _defaultConcurrency: any;
  _defaultLockLifetime: any;
  _defaultLockLimit: any;
  _definitions: JobDefinitions;
  _findAndLockNextJob = findAndLockNextJob;
  _indices: any;
  _disableAutoIndex: boolean;
  _isLockingOnTheFly: boolean;
  _isJobQueueFilling: Map<string, boolean>;
  _jobQueue: JobProcessingQueue;
  _jobsToLock: Job[];
  _lockedJobs: Job[];
  _runningJobs: Job[];
  _lockLimit: any;
  _maxConcurrency: any;
  _name: any;
  _processEvery: number;
  _ready: Promise<unknown> | undefined;
  _sort: any;
  _db!: Sequelize;
  _table!: jobs;
  _nextScanAt: any;
  _processInterval: any;
  _jobLogService?: JobLogService;
  _sequelize!: Sequelize;

  cancel!: typeof cancel;
  create!: typeof create;
  database!: typeof database;
  db_init!: typeof dbInit;
  defaultConcurrency!: typeof defaultConcurrency;
  defaultLockLifetime!: typeof defaultLockLifetime;
  defaultLockLimit!: typeof defaultLockLimit;
  define!: typeof define;
  disable!: typeof disable;
  enable!: typeof enable;
  every!: typeof every;
  jobs!: typeof jobs;
  lockLimit!: typeof lockLimit;
  maxConcurrency!: typeof maxConcurrency;
  name!: typeof name;
  now!: typeof now;
  processEvery!: typeof processEvery;
  purge!: typeof purge;
  saveJob!: typeof saveJob;
  schedule!: typeof schedule;
  sort!: typeof sort;
  start!: typeof start;
  stop!: typeof stop;
  repeatAt!: typeof repeatAt;
  jobLogs!: typeof JobLog;
  sequelize!: Sequelize;
  /**
   * Constructs a new Agenda object.
   * @param config Optional configuration to initialize the Agenda.
   * @param cb Optional callback called with the DB collection.
   */
  constructor(
    config: AgendaConfig,
    cb?: (error: Error | undefined) => void,
    jobLogService?: JobLogService
  ) {
    super();
    this._jobLogService = jobLogService;
    this.sequelize = config.db;
    this._name = config.name;
    this._processEvery = (humanInterval(config.processEvery) ??
      humanInterval("120 seconds")) as number; // eslint-disable-line @typescript-eslint/non-nullable-type-assertion-style
    this._defaultConcurrency = config.defaultConcurrency || 5;
    this._maxConcurrency = config.maxConcurrency || 100;
    this._defaultLockLimit = config.defaultLockLimit || 0;
    this._lockLimit = config.lockLimit || 0;
    this._definitions = {};
    this._runningJobs = [];
    this._lockedJobs = [];
    this._jobQueue = new JobProcessingQueue();
    this._defaultLockLifetime = config.defaultLockLifetime || 10 * 60 * 1000; // 10 minute default lockLifetime
    this._sort = config.sort || { nextRunAt: 1, priority: -1 };
    this._indices = {
      name: 1,
      ...this._sort,
      priority: -1,
      lockedAt: 1,
      nextRunAt: 1,
      disabled: 1,
    };
    this._disableAutoIndex = config.disableAutoIndex === true;

    this._isLockingOnTheFly = false;
    this._isJobQueueFilling = new Map<string, boolean>();
    this._jobsToLock = [];
    this._ready = new Promise((resolve) => {
      this.once("ready", resolve);
    });
    this.database(config.db, cb);
  }
}

Agenda.prototype.cancel = cancel;
Agenda.prototype.create = create;
Agenda.prototype.database = database;
Agenda.prototype.db_init = dbInit;
Agenda.prototype.defaultConcurrency = defaultConcurrency;
Agenda.prototype.defaultLockLifetime = defaultLockLifetime;
Agenda.prototype.defaultLockLimit = defaultLockLimit;
Agenda.prototype.define = define;
Agenda.prototype.disable = disable;
Agenda.prototype.enable = enable;
Agenda.prototype.every = every;
Agenda.prototype.jobs = jobs;
Agenda.prototype.jobLogs = JobLog;
Agenda.prototype.lockLimit = lockLimit;
Agenda.prototype.maxConcurrency = maxConcurrency;
Agenda.prototype.name = name;
Agenda.prototype.now = now;
Agenda.prototype.processEvery = processEvery;
Agenda.prototype.purge = purge;
Agenda.prototype.saveJob = saveJob;
Agenda.prototype.schedule = schedule;
Agenda.prototype.sort = sort;
Agenda.prototype.start = start;
Agenda.prototype.stop = stop;

export { Agenda };
