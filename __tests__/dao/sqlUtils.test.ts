import { sqlUtils } from '../../src/dao'

describe('stringifyStatement', () => {
  it('Should return the array formatted with separator', () => {
    expect(sqlUtils.stringifyStatement(['banana', 'uva'], ', ')).toEqual('banana, uva')
  })
  it('Should return the value formatted', () => {
    expect(sqlUtils.stringifyStatement('uva')).toEqual('uva')
  })
})

describe('normalizeColumnName', () => {
  it('Should return the column name', () => {
    expect(sqlUtils.normalizeColumnName('cesta.banana', 'cesta')).toEqual('`cesta`.`banana`')
  })
  it('Should return the column name', () => {
    expect(sqlUtils.normalizeColumnName('uva', 'cesta')).toEqual('`cesta`.`uva`')
  })
})

describe('composeConditions', () => {
  it('Should return the IN sql condition formatted', () => {
    expect(sqlUtils.composeConditions('banana', { operator: 'IN', value: true }, 'cesta')).toEqual([{ condition: '`cesta`.`banana` IN(?)', value: true }])
  })
  it('Should return the IN sql condition formatted', () => {
    expect(sqlUtils.composeConditions('banana', { operator: 'IN', value: false }, 'cesta')).toEqual([{ condition: '`cesta`.`banana` IN(?)', value: false }])
  })
  it('Should return the NOT sql condition formatted', () => {
    expect(sqlUtils.composeConditions('banana', { operator: 'NOT', value: true }, 'cesta')).toEqual([{ condition: '`cesta`.`banana` NOT ?', value: true }])
  })
  it('Should return the NOT sql condition formatted', () => {
    expect(sqlUtils.composeConditions('banana', { operator: 'NOT', value: false }, 'cesta')).toEqual([{ condition: '`cesta`.`banana` NOT ?', value: false }])
  })
  it('Should return the array of LIKE and IN sql condition formatted', () => {
    expect(sqlUtils.composeConditions('uva', [{ operator: 'LIKE', value: 'pure' }, { operator: 'IN', value: 'pure' }], 'cesta')).toEqual(
      [{ condition: ['`cesta`.`uva` LIKE ?'], value: '%pure%' }, { condition: '`cesta`.`uva` IN(?)', value: 'pure' }]
    )
  })
})

describe('decomposeObject', () => {
  it('Should return the decomposed object with an array of keys and values', () => {
    expect(sqlUtils.decomposeObject({ operator: 'IN', value: 'pure' })).toEqual({ keys: ['operator', 'value'], values: ['IN', 'pure'] })
  })
})

describe('decomposeInsertObject', () => {
  it('Should return the decomposed insert object with an array of fields and a array of values', () => {
    expect(sqlUtils.decomposeInsertObject({ keys: ['operator', 'value'], values: ['IN', 'pure'] })).toEqual({ fields: ['`keys`', '`values`'], values: [['operator', 'value'], ['IN', 'pure']] })
  })
})

describe('set', () => {
  it('Should return the object with the props defined to set', () => {
    expect(sqlUtils.set({}, 'cesta.banana', true)).toEqual({ cesta: { banana: true } })
  })
  it('Should return the an empty string', () => {
    expect(sqlUtils.set('', 'cesta.banana', true)).toEqual('')
  })
  it('Should return the object with the props defined to set', () => {
    expect(sqlUtils.set({}, '', true)).toEqual({})
  })
  it('Should return the object with the props defined to set', () => {
    expect(sqlUtils.set({}, ['cesta.banana'], true)).toEqual({ 'cesta.banana': true })
  })
  it('Should return the object with the props defined to set', () => {
    expect(sqlUtils.set({}, 'banana', true)).toEqual({ banana: true })
  })
  it('Should return the object with the props defined to set', () => {
    expect(sqlUtils.set({}, ['banana', 'cesta'], true)).toEqual({ banana: { cesta: true } })
  })
  it('Should return the object with the new value defined', () => {
    expect(sqlUtils.set({ banana: true }, ['banana'], false)).toEqual({ banana: false })
  })
  it('Should return the object', () => {
    expect(sqlUtils.set({ banana: { banana: 'true' } }, 'banana.banana', 'true')).toEqual({ banana: { banana: 'true' } })
  })
})

describe('parseResponse', () => {
  it('Should return an array of objects from the params', () => {
    expect(sqlUtils.parseResponse(['a'])).toEqual([{ 0: 'a' }])
  })
  it('Should return an array of objects from the params', () => {
    expect(sqlUtils.parseResponse([{ banana: true }, { uva: true }, { 'cesta.melancia': true }])).toEqual([{ banana: true }, { uva: true }, { cesta: { melancia: true } }])
  })
})

describe('decomposeWhere', () => {
  it('Should return the where formatted', () => {
    expect(sqlUtils.decomposeWhere({ uva: true }, 'cesta')).toEqual({ conditions: ['`cesta`.`uva` = ?'], values: [true] })
  })
  it('Should return the where formatted', () => {
    expect(sqlUtils.decomposeWhere({ uva: 'true' }, 'cesta')).toEqual({ conditions: ['`cesta`.`uva` = ?'], values: ['true'] })
  })
  it('Should return the conditions and values blanked', () => {
    expect(sqlUtils.decomposeWhere({}, 'cesta')).toEqual({ conditions: [], values: [] })
  })
  it('Should return the where formatted', () => {
    expect(sqlUtils.decomposeWhere({ uva: 123 }, 'cesta')).toEqual({ conditions: ['`cesta`.`uva` = ?'], values: [123] })
  })
})

describe('sqlError', () => {
  it('Should return the error object formatted', () => {
    expect(sqlUtils.sqlError({
      code: 500,
      message: 'deu BO',
      sql: '`cesta`.`uva` IN(?)',
      stack: 'string'
    })).toEqual({
      error: {
        code: 500,
        message: 'deu BO',
        sql: '`cesta`.`uva` IN(?)',
        stack: 'string'
      },
      statusCode: 500
    })
  })
})

describe('sqlOperators', () => {
  it('Should return the IN sql Operator formatted', () => {
    expect(sqlUtils.sqlOperators.IN({
      columnName: 'cesta',
      value: ['uva']
    })).toEqual('cesta IN(?)')
  })
  it('Should return the LIKE sql Operator formatted', () => {
    expect(sqlUtils.sqlOperators.LIKE({
      columnName: 'cesta',
      value: ['uva']
    })).toEqual(['cesta LIKE ?'])
  })
})

describe('sqlNormalizers', () => {
  it('Should return LIKE sql value formated', () => {
    expect(sqlUtils.sqlNormalizers.LIKE(['uva'])).toEqual(['%uva%'])
  })
})
