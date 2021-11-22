import { calcDigitsPositionsCnpj } from '../utils'

export const isCnpj = (cnpj: string): boolean => {
  // get first 12 numbers from cnpj
  const firstNumbers = cnpj.substr(0, 12)
  // do first calc
  const firstCalc = calcDigitsPositionsCnpj(firstNumbers, 5)
  // do second calc init by 6 position
  const secondCalc = calcDigitsPositionsCnpj(firstCalc, 6)
  // concat the second digit on cnpj
  const cnpjCalculated = secondCalc
  // verify if cnpj is the same from param
  if (cnpjCalculated === cnpj) return true
  return false
}
