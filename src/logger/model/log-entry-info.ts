import { LogEntryAsurionService, LogEntryBase, LogEntryServiceEntity } from '.';

export interface LogEntryInfo
  extends LogEntryBase,
    LogEntryAsurionService,
    LogEntryServiceEntity {}
