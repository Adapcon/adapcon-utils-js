import { getExtensionFromMimeType } from '../../src/files'

describe('Files', () => {
  it('Should correct file extension from mimeType', () => {
    expect(getExtensionFromMimeType('video/mp4')).toEqual('mp4')
  })

  it('Should return null as mimeType is unkown', () => {
    expect(getExtensionFromMimeType('log/banana')).toBeNull()
  })
})
