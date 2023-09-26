import { LogEntryError, LogEntryJobProcessingInfo } from '.';

export class LogEntryJobProcessingError extends LogEntryJobProcessingInfo implements LogEntryError {
  constructor(
    public readonly message: string, 
    public readonly error: Error
  ) {
    super(
      message,
      'ERROR'
    );

    this.error = error;
  }
}