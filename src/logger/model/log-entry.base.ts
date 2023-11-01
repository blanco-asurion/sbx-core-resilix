export abstract class LogEntryBase {
  public message: string = '';
  public keys: { [key: string]: string } = {};

  constructor(
    message: string,
    keys: { [key: string]: string } = {}
  ) {
    this.message = message;
    this.keys = keys;

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
