import { v4 as uuid } from "uuid";
import { Resilix } from "./resilix";
import { ResilixJob } from "./resilix-job";

export interface ResilixJobEntity {
  keys: { [key: string]: string }
}

export function resilixExecution(logMessage: string = '', maxRetries: number = 3, waitDuration: number = 500) {

  const resilix: Resilix = new Resilix();

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (param1: any): Promise<any> {
      return new Promise((resolve, reject) => {
        const job = new ResilixJob(uuid(), param1?.id || uuid(), param1?.keys || {}, param1, maxRetries, waitDuration);
        execute(resilix, this, job, resolve, reject, original, param1);
      });
    }
  }
}

function execute(
  resilix: Resilix,
  self: any,
  job: ResilixJob,
  resolve: (arg) => void,
  reject: (arg) => void,
  original: any,
  param1: any
) {
  setTimeout(() => {
    resilix.execute(job, async (job: ResilixJob) => {
      try {
        const result = await original.call(self, param1, job);
        resolve(result);
      } catch (err: any) {
        reject(err);
      }
    });
  }, job.getWaitDuration());
}