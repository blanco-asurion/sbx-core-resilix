import { v4 as Uuid } from 'uuid';
import { ResilixContext } from './resilix-context';

export class ResilixJob<dataType = any> {
  private result: string = 'ERROR';
  private maxRetries: number = 3;
  private retries: number = 0;
  private context?: ResilixContext;

  constructor(
    private readonly uuid: string = Uuid(),
    private readonly id: string,
    private readonly key: string,
    private readonly data: dataType,
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

    Object.defineProperty(this, 'key', {
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

  getKey() {
    return this.key;
  }

  appendLogInfo(info) {
    this.logInfo = Object.assign({}, this.logInfo, info);
  }

  setResult(result: string) {
    this.result = result;
  }

  getResult() {
    return this.result;
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

  increaseRetries() {
    this.retries++;
  }

  isRetriable() {
    return this.retries < this.maxRetries;
  }

  setMaxRetries(maxRetries: number) {
    this.maxRetries = maxRetries;
  }
}
