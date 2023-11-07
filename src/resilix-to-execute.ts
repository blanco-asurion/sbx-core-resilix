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
      return new Promise(async (resolve, reject) => {
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

        if ('setJob' in this) {
          (this as ResilixWorker).setJob(job);
        }

        await resilix.execute(job, (job: ResilixJob) => original.call(this, ...args));

        if (job.getResult() === 'ERROR') {
          return reject(job.getLastError());
        }

        return resolve(job.getOutputResult());
      });
    };
  };
}
