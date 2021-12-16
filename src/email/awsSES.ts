import AWS from 'aws-sdk'

import { error } from '../error'
import { lambdaCheckParameters } from './../lambda/lambdaCheckParameters'

const send = async ({
  region = 'us-east-1',
  html,
  subject,
  from,
  to,
  bccAddresses = []
}: {
  region?: string
  html: string
  subject: string
  from: string
  to: string[]
  bccAddresses?: string[]
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    checkParameters({ html, subject, from, to })

    const ses = new AWS.SES({ region })

    ses.sendEmail({
      Destination: {
        ToAddresses: to,
        BccAddresses: bccAddresses
      },
      Message: {
        Body: {
          Html: {
            Data: html
          }
        },
        Subject: {
          Data: subject
        }
      },
      Source: from
    }, err => {
      if (err) return reject(err)
      return resolve()
    })
  })
}

const checkParameters = (parameters: {
  html: string
  subject: string
  from: string
  to: string[]
}): void => {
  const errors: { to?: string } = { ...lambdaCheckParameters(parameters, Object.keys(parameters)) }
  if (!parameters.to || parameters.to.length === 0) errors.to = 'is empty'

  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  if (Object.keys(errors).length > 0) throw error(400, errors)
}

export const awsSES = {
  send
}
