import { LogEntryJobProcessingInfo } from '.';

export class LogEntryJobProcessingEnd extends LogEntryJobProcessingInfo {
  constructor(
    public readonly message: string, 
    public readonly keys: { [key: string]: string } = {}
  ) {
    super(message, 'END', keys);
  }
}
