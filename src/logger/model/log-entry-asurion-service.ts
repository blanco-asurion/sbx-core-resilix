import { LogEntryExecutionInfo } from '.';
import { LogEntryServiceEntity } from './log-entry-service-entity';

export interface LogEntryAsurionService
  extends LogEntryServiceEntity,
    LogEntryExecutionInfo {
  executionContext?: LogEntryServiceEntity;
  container_name?: string;
  namespace_name?: string;
  sbxloggerversion?: string;
  appVersion?: string;
}
