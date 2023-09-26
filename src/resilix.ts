import { ResilixMetricsObserver } from '.';
import {
  LogEntryAsurionService,
  LogEntryJobProcessingEnd,
  LogEntryJobProcessingError,
  LogEntryJobProcessingStart,
  LogEntryJobProcessingSuccess,
  createLoggerDecorator
} from './logger';
import { LoggerThreaded } from './logger/logger.threaded';
import { ResilixContext } from './resilix-context';
import { ResilixExecutable } from './resilix-executable';
import { ResilixFallback } from './resilix-fallback';
import { ResilixJob } from './resilix-job';
import { als } from '@sbx/sbx-core-als';

export class Resilix {
  private readonly metricsObserver: ResilixMetricsObserver;
  private readonly logger: LoggerThreaded = LoggerThreaded.getInstance();

  constructor() {
    this.metricsObserver = new ResilixMetricsObserver();
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
        context.set('scope', job.getKey());
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
          `Resilix.execute():start retries: ${job.getRetries()}`
        )
      );
      try {
        const result = await this.metricsObserver.execute(job, executable);
        this.logger.info(
          new LogEntryJobProcessingSuccess('Resilix.execute():success')
        );
        job.setResult(result);
      } catch (err: any) {
        if (job.isRetriable()) {
          await this.execute(job, executable, fallback);
        }

        this.logger.info(
          new LogEntryJobProcessingError('Resilix.execute():error', err)
        );
        job.setResult('ERROR');
        if (fallback !== undefined) {
          this.logger.info(
            new LogEntryJobProcessingStart('Resilix.execute():fallback:start')
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
                err
              )
            );
            job.setResult('ERROR');
          } finally {
            this.logger.info(
              new LogEntryJobProcessingEnd('Resilix.execute():fallback:end')
            );
          }
        }
      } finally {
        this.logger.info(new LogEntryJobProcessingEnd('Resilix.execute():end'));
      }
    });
  }

  injectLogger(core: any) {
    core['logger'] = createLoggerDecorator();
  }
}
