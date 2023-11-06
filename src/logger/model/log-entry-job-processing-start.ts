import { LogEntryJobProcessingInfo } from '.';

export class LogEntryJobProcessingStart extends LogEntryJobProcessingInfo {
  constructor(
    public readonly message: string,
    keys: { [key: string]: string } = {}
  ) {
    super(message, 'START', { ...keys });
  }
}
