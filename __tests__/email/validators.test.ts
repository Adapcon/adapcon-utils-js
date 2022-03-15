import { getEmailDomain, isEmail, isPublicDomain } from '../../src/email'

describe('isEmail', () => {
  const validEmails = ['alan@adapcon.com.br', 'teste@adapcon.com.br', 'email@domain.com', 'bruno@yahoo.com']

  test.each(validEmails)('Should return true if the email is valid', (email) => {
    expect(isEmail(email)).toBeTruthy()
  })

  const invalidEmails = ['Abc.example.com', 'A@b@c@example.com', 'a"b(c)d,e:f;g<h>i[j\\k]l@example.com',
    'just"not"right@example.com', 'this is"not\\allowed@example.com', 'this\\ still\\"not\\\\allowed@example.com', '', 123]

  test.each(invalidEmails)('Should return false if the email is invalid', (notEmail) => {
    expect(isEmail(notEmail as any)).toBeFalsy()
  })
})

describe('isPublicDomain', () => {
  const customDomainEmails = ['alan@adapcon.com.br', 'teste@simplificamais.com.br', 'email@simplificamais.com', 'bruno@portaldocliente.online']

  test.each(customDomainEmails)('Should return false if the has a custom', (email) => {
    expect(isPublicDomain(email)).toBeFalsy()
  })

  const publicDomainEmails = ['alan@bol.com.br', 'teste@outlook.com', 'email@gmail.com', 'bruno@yahoo.com']

  test.each(publicDomainEmails)('Should return true if the email has a public domain', (email) => {
    expect(isPublicDomain(email)).toBeTruthy()
  })
})

describe('getEmailDomain', () => {
  const validEmails = [
    { email: 'alan@adapcon.com.br', domain: 'adapcon.com.br' },
    { email: 'teste@simplificamais.com.br', domain: 'simplificamais.com.br' },
    { email: 'email@simplificamais.com', domain: 'simplificamais.com' },
    { email: 'bruno@portaldocliente.online', domain: 'portaldocliente.online' }
  ]

  test.each(validEmails)('Should return the email domain', (email) => {
    expect(getEmailDomain(email.email)).toBe(email.domain)
  })

  const invalidEmails = ['Abc.example.com', 'A@b@c@example.com', 'a"b(c)d,e:f;g<h>i[j\\k]l@example.com',
    'just"not"right@example.com', 'this is"not\\allowed@example.com', 'this\\ still\\"not\\\\allowed@example.com', '']

  test.each(invalidEmails)('Should return false if the email is invalid', (email) => {
    expect(getEmailDomain(email)).toBeFalsy()
  })
})
