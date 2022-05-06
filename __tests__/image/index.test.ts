import { isImage } from '../../src/image'

describe('isImage', () => {
  const validImages = ['image.gif', 'https://test.com/home/image.jpg', 'image.jpeg', 'image.png', 'https://test.com/home/image.tiff']
  const invalidImages = ['test.pdf', 'https://test.com/home/image.jpgg', 'imagepng', 'testtiff']

  test.each(validImages)('Should return true if parameter is image', (param) => {
    expect(isImage(param)).toBe(true)
  })

  test.each(invalidImages)('Should return false if parameter is not a image', (param) => {
    expect(isImage(param)).toBe(false)
  })
})
