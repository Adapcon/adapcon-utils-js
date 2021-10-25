import AWS from 'aws-sdk';

export class LambdaService {
  static async invoke({
    port = '',
    region = 'us-east-1',
    functionName,
    invocationType = 'RequestResponse',
    headers = {},
    body = {},
    pathParameters = {},
    queryStringParameters = {},
    isOffline = false,
  }: {
    port?: string,
    region?: string,
    functionName: string,
    invocationType?: string,
    headers?: object,
    body?: object,
    pathParameters?: object,
    queryStringParameters?: object,
    isOffline?: boolean,
  }): Promise<object> {
    try {
      const lambda = new AWS.Lambda({
        region,
        ...(isOffline ? {
          region: 'localhost',
          endpoint: `http://localhost:${port}`,
        } : {}),
      });

      const response = await lambda.invoke({
        FunctionName: functionName,
        InvocationType: invocationType,
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
      console.log('Error LambdaService invoke', error);
      throw error;
    }
  }

  static formattedResponse({ StatusCode, Payload }: { StatusCode?: any, Payload?: any }): object {
    const payloadFormatted = JSON.parse(Payload || '{}');

    return {
      status: payloadFormatted.statusCode || StatusCode,
      body: payloadFormatted.body ? JSON.parse(payloadFormatted.body) : {},
    };
  }
};
