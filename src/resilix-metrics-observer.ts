import _ from 'lodash';
import { performance, PerformanceObserver } from 'perf_hooks';
import { LogEntryMetric, LoggerThreaded } from './logger';
import { ResilixExecutable } from './resilix-executable';
import { ResilixJob } from './resilix-job';

export class ResilixMetricsObserver {
  private obs: PerformanceObserver;

  constructor() {
    // Activate the observer
    this.obs = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: PerformanceEntry) => {
        const job = _.get(entry, 'detail[0]');
        const logEntry = new LogEntryMetric(
          _.get(job, 'id', ''),
          entry.startTime,
          entry.duration,
          _.get(job, 'keys', {}),
          _.get(job, 'identity', ''),
          _.get(job, 'transactionid', '')
        );
        LoggerThreaded.getInstance().info(logEntry);
      });
    });
    this.obs.observe({ entryTypes: ['function'], buffered: false });
  }

  async execute(job: ResilixJob, handler: ResilixExecutable): Promise<any> {
    const perfWrapper = performance.timerify(handler);
    return await perfWrapper(job);
  }
}
