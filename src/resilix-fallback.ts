import { ResilixJob } from "./resilix-job";

export interface ResilixFallback {
  (job: ResilixJob): Promise<any>;
}