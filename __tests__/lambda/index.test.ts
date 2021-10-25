import { LambdaService } from '../../src/lambda';

describe('invoke', () => {    
  it('Should returns the function invoked response', async () => {
    await expect(LambdaService.invoke({
      port: '13011',
      functionName: 'authenticate-api-generalValidateSession',
      headers: {
        apikey: 'apikey',
      },
      pathParameters: {
        app: 'simplificamais',
        code: '',
      },
      isOffline: true,
    })).resolves.toEqual({status: 400, body: { code:  'undefined' }});
  });

  it('Should returns the function invoked with error', async () => {
    await expect(LambdaService.invoke({
      functionName: 'authenticate-api-generalValidateSession',
      headers: {
        apikey: 'apikey',
      },
      pathParameters: {
        app: 'simplificamais',
        code: '',
      },
      isOffline: false,
    })).rejects.toBeTruthy();
  });

  it('Should returns error to invoke without optional properties', async () => {
    await expect(LambdaService.invoke({
      functionName: 'authenticate-api-generalValidateSession',
    })).rejects.toBeTruthy();
  });

  it('Should returns response formatted with status code 401', () => {
    expect(LambdaService.formattedResponse({
      StatusCode: 200,
      Payload: '{"statusCode":401,"body":"{\\"error\\":\\"Invalid Session\\"}"}',
    })).toEqual({ body: { error: 'Invalid Session' }, status: 401 });
  });

  it('Should returns response formatted with status code 200', () => {
    expect(LambdaService.formattedResponse({
      StatusCode: 200,
      Payload: '{"body":"{\\"error\\":\\"Invalid Session\\"}"}',
    })).toEqual({ body: { error: 'Invalid Session' }, status: 200 });
  });

  it('Should returns response formatted without status code and message', () => {
    expect(LambdaService.formattedResponse({
      Payload: '{"error":"Invalid Session"}',
    })).toEqual({ body: {}, status: undefined });
  });

  it('Should returns response formatted without status code', () => {
    expect(LambdaService.formattedResponse({
      Payload: '{"body":"{\\"error\\":\\"Invalid Session\\"}"}',
    })).toEqual({ body: { error: 'Invalid Session' }, status: undefined });
  });

  it('Should returns response formatted without a payload', () => {
    expect(LambdaService.formattedResponse({ StatusCode: 200 })).toEqual({ body: {}, status: 200 });
  });

});
