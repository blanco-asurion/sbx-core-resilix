export class LogEntryWithKeys {
  constructor(
    public readonly jobKeys: { [key: string]: string } = {}
  ) {
    Object.defineProperty(this, 'jobKeys', {
      enumerable: false
    });

    for (let key in jobKeys) {
      Object.defineProperty(this, key, {
        value: jobKeys[key],
        enumerable: true, 
        writable: false, 
        configurable: false
      });
    }
  }
}