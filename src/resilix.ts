import { als } from '@sbx/sbx-core-als';
import { ResilixMetricsObserver } from '.';
import {
  LogEntryAsurionService,
  LogEntryJobProcessingEnd,
  LogEntryJobProcessingError,
  LogEntryJobProcessingStart,
  LogEntryJobProcessingSuccess,
  createLoggerDecorator
} from './logger';
import { LoggerThreaded } from './logger/logger-threaded';
import { ResilixContext } from './resilix-context';
import { ResilixExecutable } from './resilix-executable';
import { ResilixFallback } from './resilix-fallback';
import { ResilixJob } from './resilix-job';
const { SbxApp } = require('@sbx/sbx-archetype-api-default');

export class Resilix {
  private readonly metricsObserver: ResilixMetricsObserver;
  private readonly logger: LoggerThreaded = LoggerThreaded.getInstance();

  constructor() {
    this.metricsObserver = new ResilixMetricsObserver();

    if (SbxApp.getInstance().sbxcore) {
      this.logger.setExecutionContext(
        SbxApp.getInstance().sbxcore.config.getExecutionContext()
      );
    }
  }

  setExecutionContextServiceEntity(serviceEntity: LogEntryAsurionService) {
    this.logger.setExecutionContext(serviceEntity);
  }

  async execute(
    job: ResilixJob,
    executable: ResilixExecutable,
    fallback?: ResilixFallback
  ) {
    const store = new Map();
    store.set('transactionid', job.getUuid());
    store.set('identity', job.getId());

    await als.run(store, async () => {
      if (als.getStore() !== undefined) {
        const context: any = als.getStore();
        context.set('transactionid', job.getUuid());
        context.set('identity', job.getId());
      }

      job.setContext(new ResilixContext(LoggerThreaded.getInstance()));
      job.increaseRetries();

      this.logger.setExecutionInfo({
        identity: job.getId(),
        sender: '',
        scope: '',
        transactionid: job.getUuid(),
        sessionid: job.getId(),
        correlationid: '',
        urlpath: ''
      });
      this.logger.info(
        new LogEntryJobProcessingStart(
          `Resilix.execute():start retries: ${job.getRetries()}`,
          job.getKeys()
        )
      );
      try {
        const result = await this.executeTimer(job, executable, job.getWaitDuration());
        this.logger.info(
          new LogEntryJobProcessingSuccess(
            'Resilix.execute():success',
            job.getKeys()
          )
        );
        job.setResult('SUCCESS');
        job.setOutputResult(result);
        return result;
      } catch (err: any) {
        if (job.isRetriable()) {
          await this.execute(job, executable, fallback);
        }
        this.logger.error(
          new LogEntryJobProcessingError(
            'Resilix.execute():error',
            err,
            job.getKeys()
          )
        );
        job.setLastError(err);
        job.setResult('ERROR');
        if (fallback !== undefined) {
          this.logger.info(
            new LogEntryJobProcessingStart(
              'Resilix.execute():fallback:start',
              job.getKeys()
            )
          );
          try {
            await fallback(job);
            this.logger.info(
              new LogEntryJobProcessingSuccess(
                'Resilix.execute():fallback:success'
              )
            );
          } catch (err: any) {
            this.logger.info(
              new LogEntryJobProcessingError(
                'Resilix.execute():fallback:error',
                err,
                job.getKeys()
              )
            );
            job.setResult('ERROR');
          } finally {
            this.logger.info(
              new LogEntryJobProcessingEnd(
                'Resilix.execute():fallback:end',
                job.getKeys()
              )
            );
          }
        }
        return {};
      } finally {
        this.logger.info(
          new LogEntryJobProcessingEnd('Resilix.execute():end', job.getKeys())
        );
      }
    });
  }

  async executeTimer(job: ResilixJob, executable: ResilixExecutable, waitDuration: number): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          resolve(await this.metricsObserver.execute(job, executable));
        } catch (err) {
          reject(err);
        }
      }, waitDuration);
    });
  }
}
