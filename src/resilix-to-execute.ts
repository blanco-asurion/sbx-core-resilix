import { v4 as uuid } from 'uuid';
import { Resilix } from './resilix';
import { ResilixJob } from './resilix-job';
import { ResilixWorker } from './resilix-worker';

export interface ResilixJobEntity {
  keys: { [key: string]: string };
}

export function resilixExecution(
  logMessage = '',
  maxRetries = 1,
  waitDuration = 500
) {
  const resilix: Resilix = new Resilix();

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = async function (...args: any): Promise<any> {
      return new Promise((resolve, reject) => {
        let keys = args[0]?.keys || {};
        if ('parseKeys' in this) {
          keys = (this as ResilixWorker).parseKeys(this);
        }
        const job = new ResilixJob(
          uuid(),
          args[0]?.id || uuid(),
          keys || {},
          args[0],
          maxRetries,
          waitDuration
        );
        execute(resilix, this, job, resolve, reject, original, args);
      });
    };
  };
}

function execute(
  resilix: Resilix,
  self: any,
  job: ResilixJob,
  resolve: (arg: any) => void,
  reject: (arg: any) => void,
  original: any,
  ...args: any
) {
  setTimeout(() => {
    resilix.execute(job, async (job: ResilixJob) => {
      try {
        const params = [...[self], ...args];
        if ('setJob' in self) {
          (self as ResilixWorker).setJob(job);
        }
        const result = await original.apply(...params);
        resolve(result);
      } catch (err: any) {
        reject(err);
      }
    });
  }, job.getWaitDuration());
}
