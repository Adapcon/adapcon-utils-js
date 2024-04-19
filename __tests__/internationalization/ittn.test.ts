import { LocaleOf } from '.'
import { ittn } from '../../src/internationalization/ittn'

describe('ittn', () => {
  const localeOf = {
    test: {
      'pt-br': 'teste',
      en: 'test',
      es: 'prueba'
    },
    hello (who: string) {
      return {
        'pt-br': `Olá, ${who}!`,
        EN: `Hello, ${who}!`,
        es: `¡Hola, ${who}!`
      }
    }
  } satisfies LocaleOf

  it('Should return the translated string', () => {
    expect(ittn(localeOf.test, 'pt-br')).toBe('teste')
  })

  it('Should return the translated string', () => {
    expect(ittn(localeOf.hello('world'), 'EN')).toBe('Hello, world!')
  })

  it('Should return the translated string', () => {
    expect(ittn(localeOf.hello('mundo'), 'ES')).toBe('¡Hola, mundo!')
  })

  it('Should return the translated string', () => {
    expect(ittn(localeOf.hello('mundo'), 'pt')).toBe('Olá, mundo!')
  })

  it('Should return the translated string', () => {
    expect(ittn(localeOf.hello('mundo'))).toBe('Olá, mundo!')
  })

  it('Should return the translated string', () => {
    expect(ittn(localeOf.hello('mundo'), 'en-us')).toBe('Olá, mundo!')
  })
})
