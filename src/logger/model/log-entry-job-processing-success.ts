import { LogEntryJobProcessingInfo } from '.';

export class LogEntryJobProcessingSuccess extends LogEntryJobProcessingInfo {
  constructor(
    public readonly message: string,
    keys: { [key: string]: string } = {}
  ) {
    super(message, 'SUCCESS', keys);
  }
}
