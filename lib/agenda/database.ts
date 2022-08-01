import createDebugger from "debug";
import { Sequelize } from "sequelize-typescript";
import { Agenda } from ".";
import { DataTypes, Dialect, Model, Optional } from "sequelize";

export enum JobStatus {
  RUNNING = "RUNNING",
  FAILED = "FAILED",
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
export const database = function (
  this: Agenda,
  config: DbConfig,
  cb?: (error: any | undefined, collection: string | null) => void
): Agenda | void {
  const { dbName, host, port, user, password, dialect } = config;
  const sequelize = new Sequelize(dbName, user, password, {
    host: host,
    port: port,
    dialect: dialect,
    logging: false,
  });
  this._db = sequelize;
  initModel(this._db);
  return this;
};

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

export type entityPk = "id";
export type entityId = jobs[entityPk];
export type entityOptionalAttributes =
  | "disabled"
  | "nextRunAt"
  | "lockedAt"
  | "data"
  | "unique"
  | "uniqueOpts"
  | "repeatInterval"
  | "repeatTimezone"
  | "repeatAt"
  | "lastRunAt"
  | "lastFinishedAt"
  | "startDate"
  | "endDate"
  | "skipDays"
  | "failReason"
  | "failCount"
  | "failedAt"
  | "lastModifiedBy"
  | "shouldSaveResult"
  | "result";
export type entityCreationAttributes = Optional<
  entityAttributes,
  entityOptionalAttributes
>;

export class jobs
  extends Model<entityAttributes, entityCreationAttributes>
  implements entityAttributes
{
  id!: BigInt;
  agenda!: JSON;
  type!: string;
  name!: string;
  disabled?: boolean | undefined;
  nextRunAt?: Date | null | undefined;
  lockedAt?: Date | null | undefined;
  priority!: BigInt | string;
  data?: any;
  unique?: any;
  uniqueOpts?: { insertOnly: boolean } | undefined;
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
  status!: string;
  result?: unknown;
}

function initModel(sequelize: Sequelize): typeof jobs {
  return jobs.init(
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      agenda: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: true,
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      nextRunAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      priority: {
        type: DataTypes.BIGINT || DataTypes.STRING,
        allowNull: true,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      unique: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      uniqueOpts: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      repeatInterval: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      repeatTimezone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      repeatAt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastRunAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastFinishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATE || DataTypes.BIGINT,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE || DataTypes.BIGINT,
        allowNull: true,
      },
      skipDays: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      failReason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      failCount: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      failedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastModifiedBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shouldSaveResult: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      result: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
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
    }
  );
}
