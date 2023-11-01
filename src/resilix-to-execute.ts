import { v4 as uuid } from "uuid";
import { LogEntryJobProcessingError, LoggerThreaded } from "./logger";
import { Resilix } from "./resilix";
import { ResilixJob } from "./resilix-job";

export interface ResilixJobEntity {
  keys: { [key: string]: string }
}

export function resilixExecution(logMessage: string = '', maxRetries: number = 3, waitDuration: number = 500) {

  const resilix: Resilix = new Resilix();

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    const logger = LoggerThreaded.getInstance();
    descriptor.value = async function (param1: any): Promise<any> {
      return new Promise((resolve, reject) => {
        const job = new ResilixJob(uuid(), param1?.id || uuid(), param1?.keys || {}, param1, maxRetries, waitDuration);
        execute(resilix, this, job, resolve, reject, original, param1, logger);
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
  param1: any,
  logger: LoggerThreaded
) {
  setTimeout(() => {
    resilix.execute(job, async (job: ResilixJob) => {
      try {
        job.increaseRetries();
        const result = await original.apply(self, param1);
        resolve(result);
      } catch (err: any) {
        logger.error(new LogEntryJobProcessingError('Error at executing job', err, job.getKeys()));
        if (job.getRetries() < job.getMaxRetries()) {
          execute(resilix, self, job, resolve, reject, original, param1, logger);
        } else {
          reject(err);
        }
      }
    });
  }, job.getWaitDuration());
}