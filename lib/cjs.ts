// old common js export (see index.ts for module exports)

import { Agenda } from "./agenda";
import { SchedulerService } from "./agenda/scheduler.service";
import { AgendaModule } from "./module";
module.exports = Agenda;
module.exports.Agenda = Agenda;
module.exports.SchedulerService = SchedulerService;
module.exports.SchedulerModule = AgendaModule;
