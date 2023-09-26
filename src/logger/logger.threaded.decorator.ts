/**
 * LoggerThreadedDecorator is a decorator for the LoggerThreaded class.
 */
export class LoggerThreadedDecorator {
  constructor(private logger: any) {}

  logInfo(message, messageobj) {
    this.logger.info({ message, messageobj });
  }

  logError(message, messageobj) {
    this.logger.error({ message, messageobj });
  }
}
