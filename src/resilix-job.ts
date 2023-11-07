import { v4 as Uuid } from 'uuid';
import { ResilixContext } from './resilix-context';

export class ResilixJob<dataType = any> {
  private result: string = 'ERROR';
  private retries: number = 0;
  private context?: ResilixContext;
  private lastError?: any;
  private outputResult?: any;

  constructor(
    private readonly uuid: string = Uuid(),
    private readonly id: string,
    private readonly keys: { [key: string]: string },
    private readonly data: dataType,
    private maxRetries: number = 3,
    private waitDuration: number = 500,
    private logInfo: any = {}
  ) {
    Object.defineProperty(this, 'uuid', {
      enumerable: true,
      writable: false
    });

    Object.defineProperty(this, 'id', {
      enumerable: true,
      writable: false
    });

    Object.defineProperty(this, 'logInfo', {
      enumerable: false,
      writable: true
    });

    Object.defineProperty(this, 'keys', {
      enumerable: true,
      writable: false
    });

    Object.defineProperty(this, 'data', {
      enumerable: false,
      writable: false
    });
  }

  getId() {
    return this.id;
  }

  getUuid() {
    return this.uuid;
  }

  getKeys(): { [key: string]: string } {
    return this.keys;
  }

  getWaitDuration() {
    return this.waitDuration;
  }

  appendLogInfo(info: any) {
    this.logInfo = Object.assign({}, this.logInfo, info);
  }

  setResult(result: string) {
    this.result = result;
  }

  getResult() {
    return this.result;
  }

  setOutputResult(outputResult: any) {
    this.outputResult = outputResult;
  }

  getOutputResult() {
    return this.outputResult;
  }

  getLogInfo() {
    return this.logInfo;
  }

  setContext(context: ResilixContext) {
    this.context = context;
  }

  getContext() {
    return this.context;
  }

  getData() {
    return this.data;
  }

  getRetries() {
    return this.retries;
  }

  getMaxRetries() {
    return this.maxRetries;
  }

  increaseRetries() {
    this.retries++;
  }

  isRetriable() {
    return this.retries < this.maxRetries;
  }

  setMaxRetries(maxRetries: number) {
    this.maxRetries = maxRetries;
  }

  setLastError(lastError: any) {
    this.lastError = lastError;
  }

  getLastError() {
    return this.lastError;
  }
}
