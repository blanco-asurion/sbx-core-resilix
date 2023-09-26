import { LogEntryJobProcessingInfo } from '.';

export class LogEntryJobProcessingEnd extends LogEntryJobProcessingInfo {
  constructor(
    public readonly message: string
  ) {
    super(
      message,
      'END'
    );
  }
}
