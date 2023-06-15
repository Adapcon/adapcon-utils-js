import { stringToArray } from '../../src/string'

describe('stringToArray', () => {
  const data = [
    {
      output: []
    },
    {
      delimiter: ',',
      output: []
    },
    {
      input: 'id,style,appId',
      output: ['id', 'style', 'appId']
    },
    {
      input: 'id, style, appId',
      output: ['id', 'style', 'appId']
    },
    {
      input: '',
      output: []
    },
    {
      input: 'id',
      output: ['id']
    },
    {
      input: 'id',
      delimiter: ',',
      output: ['id']
    },
    {
      input: 'id;style;appId',
      delimiter: ';',
      output: ['id', 'style', 'appId']
    }
  ]

  test.each(data)('Should return array of string', (param) => {
    expect(stringToArray(param.input ? param.input : undefined, param.delimiter ? param.delimiter : undefined)).toStrictEqual(param.output)
  })
})
