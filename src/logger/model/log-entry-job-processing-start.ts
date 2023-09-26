import { LogEntryJobProcessingInfo } from '.';

export class LogEntryJobProcessingStart extends LogEntryJobProcessingInfo {
  constructor(public readonly message: string) {
    super(message, 'START');
  }
}
