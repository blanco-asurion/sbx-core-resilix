# Asurion SBX Resilix 
### (FEATURE CANDIDATE LIBRARY)

## Table of Contents

1. [Introduction](#introduction)
2. [Usage](#usage)
3. [API Reference](#api-reference)
4. [Examples](#examples)

## Introduction

The `Resilix` is a TypeScript implementation of a module that provides resilience features for job processing. It is designed to handle retries, fallback mechanisms, and logging for various job processing scenarios.

In addition, it also includes an observer that collects performance metrics using the API from Node.js, allowing you to monitor the execution of your jobs without impacting performance.

## Usage

```typescript
import { Resilix } from 'sbx-core-resilix';
const resilix = new Resilix();

const job = new ResilixJob(/* your job configuration */);
const executable = new ResilixExecutable(/* your executable function */);
const fallback = new ResilixFallback(/* your fallback function */);

resilix.execute(job, executable, fallback);
```

## API Reference

### `Resilix`

#### `constructor()`

- Creates an instance of the `Resilix` class.

#### `async execute(job: ResilixJob, executable: ResilixExecutable, fallback?: ResilixFallback)`

- Executes a job with the provided executable and optional fallback.

### `ResilixExecutable`

#### `interface ResilixExecutable`

- An interface for defining an executable function to process jobs.
- Accepts a `ResilixJob` parameter and returns a `Promise<any>`.
### `ResilixFallback`
#### `interface ResilixFallback`

- An interface for defining a fallback function to handle errors during job processing.
- Accepts a `ResilixJob` parameter and returns a `Promise<any>`

## Examples

Here's an example of how to use the Resilix class in a TypeScript project:

```typescript
const resilix: Resilix = new Resilix();

const job = new ResilixJob(uuid(), 'test-id', 'test-key', { test: 'test' });
job.setMaxRetries(1)

await resilix.execute(job, (job: ResilixJob): Promise<any> => {
  return new Promise((resolve, reject) => {
    resolve('OK');
  });
}, (job: ResilixJob): Promise<any> => { return Promise.resolve('FALLBACK OK') });
```
