import { ResilixJob } from "./resilix-job";

export interface ResilixWorker {
  setJob(job: ResilixJob): void;
  getJob(): ResilixJob; 
  parseKeys(source: object): { [key: string]: string };
}