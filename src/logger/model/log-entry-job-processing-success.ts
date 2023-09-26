import { LogEntryJobProcessingInfo } from '.';

export class LogEntryJobProcessingSuccess extends LogEntryJobProcessingInfo {
  constructor(
    public readonly message: string
  ) {
    super(
      message,
      'SUCCESS'
    );
  }
}
