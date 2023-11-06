export abstract class LogEntryBase {
  public message: string = '';

  constructor(message: string, keys: { [key: string]: string } | undefined = {}) {
    this.message = message;

    Object.defineProperty(this, 'keys', {
      enumerable: false
    });

    for (let key in keys) {
      Object.defineProperty(this, key, {
        value: keys[key],
        enumerable: true,
        writable: false,
        configurable: false
      });
    }
  }
}
