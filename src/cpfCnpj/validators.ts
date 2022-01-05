import { calcDigitsPositionsCnpj, calcDigitsPositionsCpf } from './utils'

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

export const isCpf = (cpf: string): boolean => {
  // get first 9 numbers from cpf
  const firstNumbers = cpf.substr(0, 9)
  // do first calc
  const firstCalc = calcDigitsPositionsCpf(firstNumbers)
  // do second calc init by 10 position
  const secondCalc = calcDigitsPositionsCpf(firstCalc, 11)
  // concat the second digit on cpf
  const cnpjCalculated = secondCalc
  // verify if cpf is the same from param
  if (cnpjCalculated === cpf) return true
  return false
}
