import { isObject, objToStr, isObjEqual, hasOwnProperty, compareJsonDiff, mergeObjectChanges } from '../../src/object'

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


describe("Merge Objects Changes tests", () => {
  describe("Merge Objects Changes tests without custom params", () => {
    it("should merge two objects", () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 1, b: 4 }
      const result = mergeObjectChanges(obj1, obj2)
      expect(result).toStrictEqual({ a: 1, b: 4 })
    })
    it("should merge two objects with nested objects", () => {

      const obj1 = { a: 1, b: { c: 2, d: 3 } }
      const obj2 = { a: 1, b: { c: 4, d: 3 } }
      const result = mergeObjectChanges(obj1, obj2)
      expect(result).toStrictEqual({ a: 1, b: { c: 4, d: 3 } })
    })

    it("should merge two objects with nested objects and arrays", () => {
      const obj1 = { a: 1, b: { c: 2, d: [1, 2] } }
      const obj2 = { a: 1, b: { c: 4, d: [1, 3] } }
      const result = mergeObjectChanges(obj1, obj2)
      expect(result).toStrictEqual({ a: 1, b: { c: 4, d: [1, 3] } })
    })

    it("should merge two objects with undefined values with not present on new object without options param", () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 1 }
      const result = mergeObjectChanges(obj1, obj2)
      expect(result).toStrictEqual({ a: 1 })
    })
  })


  describe("Merge Objects Changes tests without custom params", () => {
    it("should merge two objects with same type but diff keys and same values on keys that are in both", <T>() => {
      const obj1 = { a: 1, b: 2 } as T
      const obj2 = { a: 1, c: 3 } as T
      const result = mergeObjectChanges(obj1, obj2, {
        useOldKeysIfNotPresentInNew: true
      })
      expect(result).toStrictEqual({ a: 1, b: 2, c: 3 })
    })

    it("should merge two objects with same type but diff keys and diff values on keys that are in both", <T>() => {
      const obj1 = { a: 1, b: 2 } as T
      const obj2 = { a: 2, c: 3 } as T
      const result = mergeObjectChanges(obj1, obj2, {
        useOldKeysIfNotPresentInNew: true
      })
      expect(result).toStrictEqual({ a: 2, b: 2, c: 3 })
    })

    it("should merge two objects with new values if key is present on newObj and not on oldObj with useOldKeysIfNotPresentInNew param as true", () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 2 }
      const result = mergeObjectChanges(obj1, obj2, {
        useOldKeysIfNotPresentInNew: true
      })
      expect(result).toStrictEqual({ a: 2, b: 2 })
    })

    it("should merge two objects with new values if key is present on newObj and not on oldObj with useOldKeysIfNotPresentInNew param as false", () => {
      const obj1 = { a: 1 }
      const obj2 = { a: 1, b: 2 }
      const result = mergeObjectChanges(obj1, obj2, {
        useOldKeysIfNotPresentInNew: false
      })
      expect(result).toStrictEqual({ a: 1, b: 2 })
    })

    it("should merge two objects with old values if keys not present on new with useOldKeysIfNotPresentInNew param", () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 1 }
      const result = mergeObjectChanges(obj1, obj2, {
        useOldKeysIfNotPresentInNew: true
      })
      expect(result).toStrictEqual({ a: 1, b: 2 })
    })

    it("should merge two objects with undefined values with not present on new object without useOldKeysIfNotPresentInNew param", () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 1 }
      const result = mergeObjectChanges(obj1, obj2)
      expect(result).toStrictEqual({ a: 1 })
    })
  })

  describe("Merge Objects Changes tests with addNewKeys as false", () => {
    it("should merge two objects with new values if key is present on newObj and not on oldObj with useOldKeysIfNotPresentInNew param as true", () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 1 }
      const result = mergeObjectChanges(obj1, obj2, {
        useOldKeysIfNotPresentInNew: true,
      })
      expect(result).toStrictEqual({ a: 1, b: 2 })
    })

    it("should merge two objects with new values if key is present on newObj and not on oldObj with useOldKeysIfNotPresentInNew param as false", () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 1 }
      const result = mergeObjectChanges(obj1, obj2, {
        useOldKeysIfNotPresentInNew: false
      })
      expect(result).toStrictEqual({ a: 1 })
    })
  })

  describe("Merge Objects Changes tests with addNewKeys as true", () => {
    it("should merge two objects with new values if key is present on newObj and not on oldObj with useOldKeysIfNotPresentInNew param as true", () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 1 }
      const result = mergeObjectChanges(obj1, obj2, {
        useOldKeysIfNotPresentInNew: true,
        addNewKeys: true
      })
      expect(result).toStrictEqual({ a: 1, b: 2 })
    })

    it("should add new values with addNewKeys as true", () => {
      const obj1 = { a: 1 }
      const obj2 = { a: 1, b: 2 }
      const result = mergeObjectChanges(obj1, obj2, {
        addNewKeys: true
      })
      expect(result).toStrictEqual({ a: 1, b: 2 })
    })

    it("should add new values when addNewKeys is not set (default value is true)", () => {
      const obj1 = { a: 1 }
      const obj2 = { a: 1, b: 2 }
      const result = mergeObjectChanges(obj1, obj2)
      expect(result).toStrictEqual({ a: 1, b: 2 })
    })

    it("should not merge new values with addNewKeys params as false", () => {
      const obj1 = { a: 1 }
      const obj2 = { a: 1, b: 2 }
      const result = mergeObjectChanges(obj1, obj2, {
        addNewKeys: false
      })
      expect(result).toStrictEqual({ a: 1 })
    })
  })
})
