import { LogEntryJobProcessingInfo } from '.';

export class LogEntryJobProcessingStart extends LogEntryJobProcessingInfo {
  constructor(
    public readonly message: string,
    public readonly keys: { [key: string]: string } = {}
  ) {
    super(message, 'START', keys);
  }
}
