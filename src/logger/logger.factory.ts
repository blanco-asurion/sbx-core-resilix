import { LoggerThreaded, LoggerThreadedDecorator } from '.';

export const createLoggerDecorator = () =>
  new LoggerThreadedDecorator({ logger: LoggerThreaded.getInstance() });
