import { Mailer } from '../../src/email';

describe('send', () => {
  it('Should send an email with a simple message', async () => {
    await expect(Mailer.send({
      from: 'test@portaldocliente.online',
      to: ['test@portaldocliente.online'],
      html: 'Test of email',
      subject: 'Email Test',
    })).resolves.toBeUndefined();
  });

  it('Should return error for a incorrect sending email', async () => {
    await expect(Mailer.send({
      from: 'test@portaldocliente',
      to: ['test@portaldocliente.online'],
      html: 'Test of email',
      subject: 'Email Test',
    })).rejects.toBeTruthy();
  });

  it('Should return error for required params blank', async () => {
    await expect(Mailer.send({
      from: '',
      to: [],
      html: '',
      subject: '',
    })).rejects.toEqual({
      error: {
        from: 'undefined',
        html: 'undefined',
        subject: 'undefined',
        to: 'is empty',
      },
      statusCode: 400,
    });
  });
});

describe('bodyTemplate', () => {
  it('Should send an email with a simple message', () => {
    expect(Mailer.bodyTemplate('Test', 'Adapcon')).toBe(`
      <body style=\"background:#fff; padding:0 20px; color:#555; font-family: Arial, Helvetica, sans-serif; font-weight:200;\">
        <h2>Olá.</h2>
        <div>Test</div>
        <p>Qualquer dúvida estamos a disposição.</p>
        <p>Att.</p>
        Adapcon
      </body>
    `);
  });
});
