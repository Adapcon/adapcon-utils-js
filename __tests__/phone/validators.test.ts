import { isBrazilianCellPhone } from '../../src/phone'

describe('isBrazilianPhone', () => {
  const validPhones = [47996184675, 4794567456, '47995643784', '479956-4378', '47 99565-3403', '47 9565-3453', '47 95653453', '47 995653453'
  ]

  test.each(validPhones)('Should return true if the phone is in the brazilian format', (phone) => {
    expect(isBrazilianCellPhone(phone)).toBeTruthy()
  })

  const invalidPhones = ['96969696', '321332233221', '47 9969146784', '47 9 96919817', 12345, undefined, '4799736784a']

  test.each(invalidPhones)('Should return false if the phone is not in the brazilian format', (notPhone) => {
    expect(isBrazilianCellPhone(notPhone as any)).toBeFalsy()
  })
})
