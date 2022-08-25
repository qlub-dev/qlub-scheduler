import { Agenda } from ".";
import { Dialect, Model, Optional } from "sequelize";
export declare enum JobStatus {
    RUNNING = "RUNNING",
    FAILED = "FAILED"
}
export interface DbConfig {
    dbName: string;
    host: string;
    port: number;
    user: string;
    password: string;
    dialect?: Dialect;
}
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
export declare const database: (this: Agenda, config: DbConfig, cb?: ((error: any | undefined, collection: string | null) => void) | undefined) => Agenda | void;
export interface entityAttributes {
    id: BigInt;
    agenda: JSON;
    type: string;
    name: string;
    disabled?: boolean;
    nextRunAt?: Date | null;
    lockedAt?: Date | null;
    priority: BigInt | string;
    data?: any;
    unique?: any;
    uniqueOpts?: {
        insertOnly: boolean;
    };
    repeatInterval?: string;
    repeatTimezone?: string | null;
    repeatAt?: string;
    lastRunAt?: Date;
    lastFinishedAt?: Date;
    startDate?: Date | BigInt | null;
    endDate?: Date | BigInt | null;
    skipDays?: string | null;
    failReason?: string;
    failCount?: BigInt;
    failedAt?: Date;
    lastModifiedBy?: string;
    shouldSaveResult?: boolean;
    status: string;
    result?: unknown;
}
export declare type entityPk = "id";
export declare type entityId = jobs[entityPk];
export declare type entityOptionalAttributes = "disabled" | "nextRunAt" | "lockedAt" | "data" | "unique" | "uniqueOpts" | "repeatInterval" | "repeatTimezone" | "repeatAt" | "lastRunAt" | "lastFinishedAt" | "startDate" | "endDate" | "skipDays" | "failReason" | "failCount" | "failedAt" | "lastModifiedBy" | "shouldSaveResult" | "result";
export declare type entityCreationAttributes = Optional<entityAttributes, entityOptionalAttributes>;
export declare class jobs extends Model<entityAttributes, entityCreationAttributes> implements entityAttributes {
    id: BigInt;
    agenda: JSON;
    type: string;
    name: string;
    disabled?: boolean | undefined;
    nextRunAt?: Date | null | undefined;
    lockedAt?: Date | null | undefined;
    priority: BigInt | string;
    data?: any;
    unique?: any;
    uniqueOpts?: {
        insertOnly: boolean;
    } | undefined;
    repeatInterval?: string | undefined;
    repeatTimezone?: string | null | undefined;
    repeatAt?: string | undefined;
    lastRunAt?: Date | undefined;
    lastFinishedAt?: Date | undefined;
    startDate?: BigInt | Date | null | undefined;
    endDate?: BigInt | Date | null | undefined;
    skipDays?: string | null | undefined;
    failReason?: string | undefined;
    failCount?: BigInt | undefined;
    failedAt?: Date | undefined;
    lastModifiedBy?: string | undefined;
    shouldSaveResult?: boolean | undefined;
    status: string;
    result?: unknown;
}
//# sourceMappingURL=database.d.ts.map