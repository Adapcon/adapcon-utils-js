import { error } from '../../src/error'

describe('error', () => {
  it('Should format error with a error object', () => {
    expect(error(400, { id: undefined })).toEqual({ statusCode: 400, error: { id: undefined } })
  })

  it('Should format error with a error string', () => {
    expect(error(400, 'Incorrect id value')).toEqual({ statusCode: 400, message: 'Incorrect id value' })
  })
})
