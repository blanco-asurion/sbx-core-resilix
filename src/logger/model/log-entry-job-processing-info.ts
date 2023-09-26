import { LogEntryInfo } from './log-entry-info';
import { LogEntryServiceEntity } from './log-entry-service-entity';

export class LogEntryJobProcessingInfo implements LogEntryInfo {
  public readonly kpi?: boolean;

  constructor(
    public readonly message: string,
    public readonly jobProcessingResult: string = 'ERROR',
    public readonly identity?: string,
    public readonly sender?: string,
    public readonly scope?: string,
    public readonly transactionid?: string,
    public readonly sessionid?: string,
    public readonly correlationid?: string,
    public readonly urlpath?: string,
    public readonly executionContext?: LogEntryServiceEntity,
    public readonly container_name?: string,
    public readonly namespace_name?: string,
    public readonly sbxloggerversion?: string,
    public readonly appVersion?: string,
    public readonly system?: string,
    public readonly subssytem?: string,
    public readonly capability?: string,
    public readonly resource?: string
  ) {
    this.kpi = true;
  }
}
