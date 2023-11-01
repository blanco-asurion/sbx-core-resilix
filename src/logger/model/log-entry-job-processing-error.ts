import { LogEntryError, LogEntryJobProcessingInfo } from '.';

export class LogEntryJobProcessingError extends LogEntryJobProcessingInfo implements LogEntryError {
  constructor(
    public readonly message: string,
    public readonly error: Error, 
    public readonly keys: { [key: string]: string } = {}
  ) {
    super(message, 'ERROR', keys);

    this.error = error;
  }
}
