// import { LambdaService } from '../../src/lambda';

describe('invoke', () => {
  it('Should returns the function invoked response', async () => {
    /**
     * We need test it with mocks
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

     */
  })

  it('Should returns the function invoked with error', async () => {
    /**
     * We need test it with mocks
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
    **/
  })

  it('Should returns error to invoke without optional properties', async () => {
    /**
     * We need test it with mocks
    await expect(LambdaService.invoke({
      functionName: 'authenticate-api-generalValidateSession',
    })).rejects.toBeTruthy();
    **/
  })
})
