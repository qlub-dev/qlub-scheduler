import { Module, DynamicModule, Provider, Inject } from "@nestjs/common";
import {
  AgendaModuleOptions,
  AgendaModuleAsyncOptions,
  AgendaOptionsFactory,
} from ".";
import { AGENDA_MODULE_OPTIONS } from "./scheduler.constant";
import { SchedulerService } from "../agenda/scheduler.service";
import { Agenda } from "../agenda";

function createAgendaProvider(options: AgendaModuleOptions): any[] {
  return [{ provide: AGENDA_MODULE_OPTIONS, useValue: options || {} }];
}

export class AgendaService extends Agenda {}

@Module({
  providers: [
    {
      provide: AgendaService,
      useFactory: async (options: AgendaModuleOptions) => {
        return new Agenda(options, (error) => {
          console.log("Error: ", error);
        });
      },
      inject: [AGENDA_MODULE_OPTIONS],
    },
  ],
  exports: [AgendaService],
})
export class AgendaModule {
  static register(options: AgendaModuleOptions): DynamicModule {
    return {
      module: AgendaModule,
      providers: createAgendaProvider(options),
    };
  }

  // static registerAsync(options: AgendaModuleAsyncOptions): DynamicModule {
  //   return {
  //     module: AgendaModule,
  //     imports: options.imports || [],
  //     providers: this.createAsyncProviders(options),
  //   };
  // }

  // private static createAsyncProviders(
  //   options: AgendaModuleAsyncOptions
  // ): Provider[] {
  //   if (options.useExisting || options.useFactory) {
  //     return [this.createAsyncOptionsProvider(options)];
  //   }
  //   return [
  //     this.createAsyncOptionsProvider(options),
  //     {
  //       provide: options.useClass,
  //       useClass: options.useClass,
  //     },
  //   ];
  // }

  // private static createAsyncOptionsProvider(
  //   options: AgendaModuleAsyncOptions
  // ): Provider {
  //   if (options.useFactory) {
  //     return {
  //       provide: AGENDA_MODULE_OPTIONS,
  //       useFactory: options.useFactory,
  //       inject: options.inject || [],
  //     };
  //   }
  //   return {
  //     provide: AGENDA_MODULE_OPTIONS,
  //     // tslint:disable-next-line:max-line-length
  //     useFactory: async (optionsFactory: AgendaOptionsFactory) =>
  //       await optionsFactory.createAgendaOptions(),
  //     inject: [options.useExisting || options.useClass],
  //   };
  // }
}
