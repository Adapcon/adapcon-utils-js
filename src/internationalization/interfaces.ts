export type Sentence = Record<string, string>
export type DynamicSentence = (...args: Array<string | number>) => Sentence
export type LocaleOf = Record<string, Sentence | DynamicSentence>
