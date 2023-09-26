import { LogEntryInfo, LogEntryServiceEntity } from '.';

export class LogEntryMetric implements LogEntryInfo {
  public readonly message: string;
  public readonly kpi: boolean;
  public readonly performance: boolean;

  constructor(
    public readonly id: string,
    public readonly startTime: number,
    public readonly duration: number,
    public readonly identity?: string,
    public readonly transactionid?: string,
    public readonly sender?: string,
    public readonly scope?: string,
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
    this.message = `Performance ${id} took ${(duration / 1000).toFixed(2)}s`;
    this.kpi = true;
    this.performance = true;
  }
}
