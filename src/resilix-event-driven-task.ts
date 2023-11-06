import { ResilixExecutable } from './resilix-executable';

/**
 * This class is used to create a task that is executed on a regular basis.
 */
export abstract class ResilixEventDrivenTask {
  // private timeoutId: NodeJS.Timeout;

  constructor(private readonly task: ResilixExecutable) {
    // this.tim
  }

  start() {
    // this.timeoutId = setTimeout(() => {});
  }

  stop() {
    // clearTimeout(this.timeoutId);
  }
}
