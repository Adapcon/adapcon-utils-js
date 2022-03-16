import { getEmailDomain } from '../../src/email'

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
