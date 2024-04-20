import { Sentence } from './interfaces'

export const defaultLang = 'pt-br'

/**
 * Internationalization translation to nation
 */
export const ittn = (sentence: Sentence, lang = defaultLang) => {
  const locale = sentence[lang]
  if (locale) return locale

  const langs = Object.keys(sentence)
  const lowerLang = lang.toLowerCase()
  if (langs.includes(lowerLang)) return sentence[lowerLang]

  const simpleLang = lowerLang.split('-')[0]
  if (langs.includes(simpleLang)) return sentence[simpleLang]

  return sentence[langs[0]]
}
