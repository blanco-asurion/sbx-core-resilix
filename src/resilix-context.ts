import { LoggerThreaded } from './logger';

export class ResilixContext {
  constructor(public readonly logger: LoggerThreaded) {}
}
