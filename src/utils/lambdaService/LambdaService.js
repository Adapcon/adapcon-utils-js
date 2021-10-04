const AWS = require('aws-sdk');

module.exports = class LambdaService {
  constructor({ port = '3044' } = {}) {
    this._port = port;
  }

  async invoke({
    functionName = '',
    headers = {},
    body = {},
    pathParameters = {},
    queryStringParameters = {},
  } = {}) {
    try {
      const lambda = new AWS.Lambda({
        region: 'us-east-1',
        ...(process.env.IS_OFFLINE ? {
          region: 'localhost',
          endpoint: `http://localhost:${this._port}`,
        } : {}),
      });

      const response = await lambda.invoke({
        FunctionName: `lead-capture-api-${functionName}`,
        InvocationType: 'Event',
        Payload: Buffer.from(
          JSON.stringify({
            headers,
            body,
            pathParameters,
            queryStringParameters,
          }),
        ),
      }).promise();
      return this.formattedResponse(response);
    } catch (error) {
      console.log('hybrid lambdaService.invoke - LOG:', error);
    }
  }

  formattedResponse({ StatusCode, Payload } = {}) {
    const payloadFormatted = JSON.parse(Payload || '{}');

    return {
      status: payloadFormatted.statusCode || StatusCode,
      body: payloadFormatted.body ? JSON.parse(payloadFormatted.body) : {},
    };
  }
};
