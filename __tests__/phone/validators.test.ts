import { isBrazilianCellPhoneFormat, isSamePhone } from '../../src/phone'

describe('isBrazilianPhone', () => {
  const validPhones = [47996184675, 4794567456, '47995643784', '479956-4378', '47 99565-3403', '47 9565-3453', '47 95653453', '47 995653453'
  ]

  test.each(validPhones)('Should return true if the phone is in the brazilian format', (phone) => {
    expect(isBrazilianCellPhoneFormat(phone)).toBeTruthy()
  })

  const invalidPhones = ['96969696', '321332233221', '47 9969146784', '47 9 96919817', 12345, undefined, '4799736784a']

  test.each(invalidPhones)('Should return false if the phone is not in the brazilian format', (notPhone) => {
    expect(isBrazilianCellPhoneFormat(notPhone as any)).toBeFalsy()
  })
})

describe('isSamePhone', () => {
  const samePhones = [
    { phone1: '47996919816', phone2: '47996919816' },
    { phone1: '4796919816', phone2: '4796919816' },
    { phone1: '47996919816', phone2: '4796919816' },
    { phone1: '5547996919816', phone2: '47996919816' },
    { phone1: '5547996919816', phone2: '4796919816' },
    { phone1: '4796919816', phone2: '5547996919816' }
  ]

  const differentPhones = [
    { phone1: '47996919816', phone2: '47986919816' },
    { phone1: '4796919816', phone2: '4786919816' },
    { phone1: '55996919816', phone2: '47996919816' }
  ]

  test.each(samePhones)('Should return true if the phones are the same', (param) => {
    expect(isSamePhone(param.phone1, param.phone2)).toBeTruthy()
  })

  test.each(differentPhones)('Should return true if the phones are not the same', (param) => {
    expect(isSamePhone(param.phone1, param.phone2)).toBeFalsy()
  })
})
