import { LogEntryJobProcessingInfo } from '.';

export class LogEntryJobProcessingEnd extends LogEntryJobProcessingInfo {
  constructor(
    public readonly message: string,
    keys: { [key: string]: string } = {}
  ) {
    super(message, 'END', keys);
  }
}
