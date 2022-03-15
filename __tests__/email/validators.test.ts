import { isEmail, hasPublicDomain } from '../../src/email'

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

describe('hasPublicDomain', () => {
  const invalidEmails = ['Abc.example.com', 'A@b@c@example.com', 'a"b(c)d,e:f;g<h>i[j\\k]l@example.com',
    'just"not"right@example.com', 'this is"not\\allowed@example.com', 'this\\ still\\"not\\\\allowed@example.com',
    '', 'alan@adapcon.com.br', 'teste@simplificamais.com.br', 'email@simplificamais.com', 'bruno@portaldocliente.online']

  test.each(invalidEmails)('Should return false if the has a custom', (email) => {
    expect(hasPublicDomain(email)).toBeFalsy()
  })

  const validEmails = ['alan@bol.com.br', 'teste@outlook.com', 'email@gmail.com', 'bruno@yahoo.com']

  test.each(validEmails)('Should return true if the email has a public domain', (email) => {
    expect(hasPublicDomain(email)).toBeTruthy()
  })
})
