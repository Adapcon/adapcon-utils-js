import { isObject, objToStr } from '../../src/object';

describe('isObject', () => {
  const validObjects = [{}, { music: 'on' }, { list: [1, 2, 3] }];
  const invalidObjects = [123, 1, 'cookie', String(1), '1 3 5', Number(1), [10, '0', 'apple'], 123.31];

  test.each(validObjects)('Should return true if parameter is object', (param) => {
    expect(isObject(param)).toEqual(true)
  });

  test.each(invalidObjects)('Should return false if parameter is not a object', (param) => {
    expect(isObject(param)).toEqual(false)
  });
});

describe('objToStr', () => {
  it('Should return the object formatted to a string', () => {
    expect(objToStr({ error: 'Invalid value',  })).toEqual('{\"error\":\"Invalid value\"}')
  });

  it('Should return the object formatted to a string', () => {
    expect(objToStr('Invalid value')).toEqual('Invalid value')
  });
});