import { isObject, objToStr, isObjEqual, hasOwnProperty, compareJsonDiff } from '../../src/object'

const objectA = {
  name: 'adapcon',
  city: 'jaragua',
  state: 'sc',
  country: undefined
}

const objectB = {
  name: 'simplifica',
  city: 'jaragua'
}

const objectC = {
  name: 'simplifica',
  city: 'jaragua',
  state: 'sc',
  country: null,
  street: ''
}

describe('hasOwnProperty', () => {
  it('Should return true if object has property', () => {
    expect(hasOwnProperty(objectA, 'name')).toBeTruthy()
  })
  it('Should return false if object hasn\'t property', () => {
    expect(hasOwnProperty(objectA, 'region')).toBeFalsy()
  })
})

describe('compareJsonDiff', () => {
  it('Should return the difference between object and the removed properties', () => {
    expect(compareJsonDiff({ baseObject: objectA, compareObject: objectC })).toEqual({ diff: { name: 'simplifica' }, removed: [] })
  })
  it('Should return the difference between object and the removed properties', () => {
    expect(compareJsonDiff({ baseObject: objectA, compareObject: objectB })).toEqual({ diff: { name: 'simplifica' }, removed: ['state', 'country'] })
  })
  it('Should return the difference between object and the removed properties', () => {
    expect(compareJsonDiff({ baseObject: {}, compareObject: objectB })).toEqual({ diff: { name: 'simplifica', city: 'jaragua' }, removed: [] })
  })
  it('Should return the difference between object and the removed properties', () => {
    expect(compareJsonDiff({ baseObject: {}, compareObject: {} })).toEqual({ diff: {}, removed: [] })
  })
})

describe('isObject', () => {
  const validObjects = [{}, { music: 'on' }, { list: [1, 2, 3] }]
  const invalidObjects = [123, 1, 'cookie', String(1), '1 3 5', Number(1), [10, '0', 'apple'], 123.31]

  test.each(validObjects)('Should return true if parameter is object', (param) => {
    expect(isObject(param)).toEqual(true)
  })

  test.each(invalidObjects)('Should return false if parameter is not a object', (param) => {
    expect(isObject(param)).toEqual(false)
  })
})

describe('objToStr', () => {
  it('Should return the object formatted to a string', () => {
    expect(objToStr({ error: 'Invalid value' })).toEqual('{"error":"Invalid value"}')
  })

  it('Should return the object formatted to a string', () => {
    expect(objToStr('Invalid value')).toEqual('Invalid value')
  })
})

describe('isObjEqual', () => {
  it('Should return the objects are equal', () => {
    expect(isObjEqual({ test: '1' }, { test: '1' })).toEqual(true)
  })

  it('Should return the dates are equal', () => {
    expect(isObjEqual(new Date('2022-05-06'), new Date('2022-05-06'))).toEqual(true)
  })

  it('Should return the objects are not equal', () => {
    expect(isObjEqual({ test: 1 }, { test: '1' })).toEqual(false)
  })

  it('Should return the dates are not equal', () => {
    expect(isObjEqual(new Date('2022-05-06'), new Date('2022-05-07'))).toEqual(false)
  })

  it('Should return false to undefined parameter', () => {
    expect(isObjEqual({ test: '1' }, undefined)).toEqual(false)
  })

  it('Should return false to undefined parameter', () => {
    expect(isObjEqual(undefined, { test: '1' })).toEqual(false)
  })

  it('Should return false to null parameter', () => {
    expect(isObjEqual(null, { test: '1' })).toEqual(false)
  })

  it('Should return false to null parameter', () => {
    expect(isObjEqual({ test: '1' }, null)).toEqual(false)
  })

  it('Should return false to null and undefined parameters', () => {
    expect(isObjEqual(null, undefined)).toEqual(false)
  })

  it('Should return false to undefined and null parameters', () => {
    expect(isObjEqual(undefined, null)).toEqual(false)
  })

  it('Should return false to different prototypes', () => {
    expect(isObjEqual(Object, { test: '1' })).toEqual(false)
  })

  it('Should return false to different keys', () => {
    expect(isObjEqual({ name: 'João' }, { name: 'João', age: '20' })).toEqual(false)
  })

  it('Should return false to different keys', () => {
    expect(isObjEqual(undefined, undefined)).toEqual(true)
  })

  it('Should return false to different keys', () => {
    expect(isObjEqual(null, null)).toEqual(true)
  })
})
