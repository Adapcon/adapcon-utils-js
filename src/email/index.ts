import AWS from 'aws-sdk';

import { error } from '../error';

export class Mailer {
  static send({
    region = 'us-east-1',
    html,
    subject,
    from,
    to,
    bccAddresses = [],
  }: {
    region?: string
    html: string,
    subject: string,
    from: string,
    to: Array<string>,
    bccAddresses?: Array<string>,
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      this._checkParameters({ html, subject, from, to });

      const ses = new AWS.SES({ region });

      ses.sendEmail({
        Destination: {
          ToAddresses: to,
          BccAddresses: bccAddresses,
        },
        Message: {
          Body: {
            Html: {
              Data: html,
            },
          },
          Subject: {
            Data: subject,
          },
        },
        Source: from,
      }, err => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  static bodyTemplate(message: string, company: string): string {
    return `
      <body style="background:#fff; padding:0 20px; color:#555; font-family: Arial, Helvetica, sans-serif; font-weight:200;">
        <h2>Olá.</h2>
        <div>${message}</div>
        <p>Qualquer dúvida estamos a disposição.</p>
        <p>Att.</p>
        ${company}
      </body>
    `;
  }

  static _checkParameters({
    html,
    subject,
    from,
    to,
  }: {
    html: string,
    subject: string,
    from: string,
    to: Array<string>,
  }) {
    const errors: any = {};

    if (!html) errors.html = 'undefined';

    if (!from) errors.from = 'undefined';

    if (to.length === 0) errors.to = 'is empty';

    if (!subject) errors.subject = 'undefined';

    if (Object.keys(errors).length > 0) throw error(400, errors);
  }
};
