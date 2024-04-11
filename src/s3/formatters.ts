import { Readable } from 'stream';

export const streamToString = async (stream: Readable) => new Promise((resolve, reject) => {
  const chunks: any[] = []

  stream.on('data', (chunk: any) => chunks.push(chunk))
  stream.on('error', reject)
  stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
})
