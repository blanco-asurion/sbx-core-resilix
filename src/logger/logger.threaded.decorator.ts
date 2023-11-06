/**
 * LoggerThreadedDecorator is a decorator for the LoggerThreaded class.
 */
export class LoggerThreadedDecorator {
  constructor(private logger: any) {}

  logInfo(message: string, messageobj: any) {
    this.logger.info({ message, messageobj });
  }

  logError(message: string, messageobj: any) {
    this.logger.error({ message, messageobj });
  }
}
