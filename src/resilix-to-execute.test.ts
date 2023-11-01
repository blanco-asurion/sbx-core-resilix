import { ResilixJobEntity, resilixExecution } from './resilix-to-execute';

describe('Test TO-EXECUTE', () => {

  jest.setTimeout(30000);

  class TestRequest implements ResilixJobEntity {
    keys: { [key: string]: string; } = {};

    constructor() {
      this.keys['SERVICE_JOB_ID'] = '123';
      this.keys['SERVICE_JOB_NAME'] = 'test';
    }
  }

  class TestClass {
    private test: number;
    constructor() {
      this.test = 1;
    }

    @resilixExecution('hola')
    async method_1(test: TestRequest): Promise<any> {  
      return 'OK';
    }
  }

  test('test 1', async () => {
    const t = new TestClass();
    const req = new TestRequest();
    const result = await t.method_1(req);

    expect(result).toBe('OK');
  });
});


