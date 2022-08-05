import { ModuleMetadata, Type } from "@nestjs/common/interfaces";
import { DbConfig } from "../agenda/database";

export interface AgendaModuleOptions {
  name: string;
  db: DbConfig;
}

export interface AgendaOptionsFactory {
  createAgendaOptions(): Promise<AgendaModuleOptions> | AgendaModuleOptions;
}

export interface AgendaModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useExisting?: Type<AgendaOptionsFactory>;
  useClass?: Type<AgendaOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<AgendaModuleOptions> | AgendaModuleOptions;
  inject?: any[];
}
