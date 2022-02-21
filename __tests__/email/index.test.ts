import { awsSES, bodyTemplate } from '../../src/email'
import { SecretManager } from './../../src/secretsManager/index'

describe('send', () => {
  const mockGetValue = jest.spyOn(SecretManager, 'getValue')
  mockGetValue.mockImplementation(async ({ region, secretId }: { region?: string, secretId: any }) => {
    if (region ?? secretId) { return {} }
    return {}
  })

  it('Should send an email with a simple message', async () => {
    await expect(awsSES.send({
      from: 'test@portaldocliente.online',
      to: ['test@portaldocliente.online'],
      html: 'Test of email',
      subject: 'Email Test',
      serviceSecretArn: ''
    })).resolves.toBeUndefined()
  })

  it('Should return error for a incorrect sending email', async () => {
    await expect(awsSES.send({
      from: 'test@portaldocliente',
      to: ['test@portaldocliente.online'],
      html: 'Test of email',
      subject: 'Email Test'
    })).rejects.toBeTruthy()
  })

  it('Should return error for required params blank', async () => {
    await expect(awsSES.send({
      from: '',
      to: [],
      html: '',
      subject: ''
    })).rejects.toEqual({
      error: {
        from: 'null',
        html: 'null',
        subject: 'null',
        to: 'is empty'
      },
      statusCode: 400
    })
  })

  mockGetValue.mockRestore()
})

describe('bodyTemplate', () => {
  it('Should send an email with a simple message', () => {
    expect(bodyTemplate('Test', 'Adapcon')).toBe(`
      <body style="background:#fff; padding:0 20px; color:#555; font-family: Arial, Helvetica, sans-serif; font-weight:200;">
        <h2>Olá.</h2>
        <div>Test</div>
        <p>Qualquer dúvida estamos a disposição.</p>
        <p>Att.</p>
        Adapcon
      </body>`)
  })
})
