"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobs = exports.database = exports.JobStatus = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
var JobStatus;
(function (JobStatus) {
    JobStatus["RUNNING"] = "RUNNING";
    JobStatus["FAILED"] = "FAILED";
})(JobStatus = exports.JobStatus || (exports.JobStatus = {}));
/**
 * Connect to the spec'd DB server and database.
 *
 * NOTE:
 * If `url` includes auth details then `options` must specify: { 'uri_decode_auth': true }. This does Auth on
 * the specified database, not the Admin database. If you are using Auth on the Admin DB and not on the Agenda DB,
 * then you need to authenticate against the Admin DB and then pass the DB instance into the constructor
 * or use Agenda.mongo(). If your app already has a DB connection then use that. ie. specify config.mongo in
 * the constructor or use Agenda.mongo().
 * @name Agenda#database
 * @function
 * @param url DB server URI
 * @param [collection] name of collection to use. Defaults to `agendaJobs`
 * @param [options] options for connecting
 * @param [cb] callback of DB connection
 */
const database = function (config, cb) {
    const { dbName, host, port, user, password, dialect } = config;
    const sequelize = new sequelize_typescript_1.Sequelize(dbName, user, password, {
        host: host,
        port: port,
        dialect: dialect,
        logging: false,
    });
    this._db = sequelize;
    initModel(this._db);
    return this;
};
exports.database = database;
class jobs extends sequelize_1.Model {
}
exports.jobs = jobs;
function initModel(sequelize) {
    return jobs.init({
        id: {
            autoIncrement: true,
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
        },
        agenda: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        type: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            defaultValue: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            defaultValue: true,
        },
        disabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true,
        },
        nextRunAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        priority: {
            type: sequelize_1.DataTypes.BIGINT || sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        data: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        unique: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        uniqueOpts: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        repeatInterval: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        repeatTimezone: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        repeatAt: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        lastRunAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        lastFinishedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE || sequelize_1.DataTypes.BIGINT,
            allowNull: true,
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE || sequelize_1.DataTypes.BIGINT,
            allowNull: true,
        },
        skipDays: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        failReason: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        failCount: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: true,
        },
        failedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        lastModifiedBy: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        shouldSaveResult: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: true,
        },
        result: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: "jobs",
        schema: "public",
        timestamps: true,
        indexes: [
            {
                name: "job_pkey",
                unique: true,
                fields: [{ name: "id" }],
            },
        ],
    });
}
//# sourceMappingURL=database.js.map