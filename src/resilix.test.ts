import { describe, expect, test } from '@jest/globals';
import { v4 as uuid } from 'uuid';
import { Resilix, ResilixJob } from '.';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('Tests', () => {
  jest.setTimeout(600000);

  test('Test 1', async () => {
    const resilix: Resilix = new Resilix();

    resilix.setExecutionContextServiceEntity({
      system: 'system-test',
      subsystem: 'subsystem-test',
      capability: 'capability-test',
      resource: 'resource-test'
    });

    const job = new ResilixJob(uuid(), 'test-id', { key1: 'test-key' }, { test: 'test' });

    await resilix.execute(job, (job: ResilixJob): Promise<any> => {
      return new Promise((resolve, reject) => {
        try {
          resolve('OK');
        } catch (err) {
          reject('ERROR');
        }
      });
    });

    expect(job.getResult()).toBe('OK');
  });

  test('Test 2', async () => {
    const resilix: Resilix = new Resilix();
    resilix.injectLogger(console);

    const job = new ResilixJob(uuid(), 'test-id', { key1: 'test-key' }, { test: 'test' });

    await resilix.execute(job, (job: ResilixJob): Promise<any> => {
      return new Promise((resolve, reject) => {
        reject('ERROR');
      });
    });

    expect(job.getResult()).toBe('ERROR');
  });

  test('Test 3', async () => {
    const resilix: Resilix = new Resilix();
    resilix.setExecutionContextServiceEntity({
      appVersion: '1.9.9'
    });
    resilix.injectLogger(console);

    const job = new ResilixJob(uuid(), 'test-id', { key1: 'test-key' }, { test: 'test' });
    job.setMaxRetries(1);

    await resilix.execute(
      job,
      (job: ResilixJob): Promise<any> => {
        return new Promise((resolve, reject) => {
          reject('ERROR');
        });
      },
      (job: ResilixJob): Promise<any> => {
        return Promise.resolve('FALLBACK OK');
      }
    );

    expect(job.getResult()).toBe('ERROR');
    expect(job.getRetries()).toBe(1);
  });

  afterAll(async () => {
    await sleep(10000);
  });
});
