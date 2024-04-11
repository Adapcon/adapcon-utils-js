import { Readable } from 'stream';

export const streamToString = async (stream: Readable | ReadableStream | Blob) => new Promise((resolve, reject) => {
  const chunks = []
  stream.on('data', chunk => chunks.push(chunk))
  stream.on('error', reject)
  stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
})
