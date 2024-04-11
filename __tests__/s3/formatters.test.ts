import { streamToString } from '../../src/s3'
import stream from 'stream'

describe('streamToString', () => {
  it('should convert a stream to a string', async () => {
    const readable = new stream.Readable()

    readable._read = () => {}
    readable.push('Hello, ')
    readable.push('world!')
    readable.push(null)

    const result = await streamToString(readable)
    expect(result).toEqual('Hello, world!')
  })

  it('should convert a JSON stream to a string', async () => {
    const json = { name: 'John Doe', age: 30 }
    const jsonString = JSON.stringify(json)
    const readable = new stream.Readable()

    readable._read = () => {}
    readable.push(jsonString)

    const result = await streamToString(readable)
    expect(result).toEqual(jsonString)
  })


})
