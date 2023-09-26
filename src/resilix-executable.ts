import { ResilixJob } from './resilix-job';

export interface ResilixExecutable {
  (job: ResilixJob): Promise<any>;
}
