import { whitelist } from '../src';

describe("(whitelist) Filter object by array of allowed values", () => {

  test("I filter out every key-value pair except 'id' and 'param1'", () => {
    const inputObject = {
      id: 3,
      param1: 'adipiscing',
      param2: 'elit sed do',
      param3: 'eiusmod'
    };
    const allowedKeys = ['id', 'param1'];

    const expectedOutput = {
      id: 3,
      param1: 'adipiscing',
    };

    // Test your implementation
    expect(whitelist(inputObject, allowedKeys)).toEqual(expectedOutput);
  });

});

