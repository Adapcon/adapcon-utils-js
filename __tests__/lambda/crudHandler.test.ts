import { lambdaCrudHandler } from "../../src/lambda";
import { APIGatewayEvent } from "aws-lambda";

const defaultValueEvent = {
  isBase64Encoded: false,
  multiValueHeaders: {},
  multiValueQueryStringParameters: {},
  path: "",
  queryStringParameters: {},
  requestContext: {
    accountId: "",
    apiId: "",
    authorizer: {
      claims: undefined,
      scopes: undefined,
      principalId: "",
    },
    domainName: "",
    domainPrefix: "",
    extendedRequestId: "",
    httpMethod: "",
    identity: {
      accessKey: null,
      accountId: "",
      apiKey: "",
      apiKeyId: "",
      caller: "",
      cognitoAuthenticationProvider: "",
      cognitoAuthenticationType: "",
      cognitoIdentityId: "",
      cognitoIdentityPoolId: "",
      principalOrgId: null,
      sourceIp: "",
      user: "",
      userAgent: "",
      userArn: "",
      clientCert: {
        clientCertPem: "",
        serialNumber: "",
        subjectDN: "",
        issuerDN: "",
        validity: {
          notAfter: "",
          notBefore: "",
        },
      },
    },
    path: "",
    protocol: "",
    requestId: "",
    requestTime: "",
    requestTimeEpoch: 1641927496169,
    resourceId: "",
    resourcePath: "",
    stage: "",
  },
  resource: "",
  stageVariables: {},
};

describe("lambdaCrudHandler", () => {
  const param: { event: APIGatewayEvent; output: {} }[] = [
    {
      event: {
        body: JSON.stringify({
          liveId: "c94f0038e5429e65337a2640529faddf",
          entityCode: "26855624000184",
          Infos:
            {
              item: "14936",
              quantity: "4",
              value: 7.11,
            },
        }),
        pathParameters: {},
        headers: {},
        httpMethod: "PUT",
        ...defaultValueEvent,
      },
      output: {
        httpMethod: "PUT",
        body: JSON.stringify({
          liveId: "c94f0038e5429e65337a2640529faddf",
          entityCode: "26855624000184",
          Infos: {
            item: "14936",
            quantity: "4",
            value: 7.11,
          },
        }),
      },
    },
    {
      event: {
        body: JSON.stringify({
          liveId: "c94f0038e5429e65337a2640529faddf",
          entityCode: "26855624000184",
          Infos:
            {
              item: "14936",
              quantity: "4",
              value: 7.11,
            },
        }),
        pathParameters: {},
        headers: {},
        httpMethod: "POST",
        ...defaultValueEvent,
      },
      output: {
        httpMethod: "POST",
        body: JSON.stringify({
          liveId: "c94f0038e5429e65337a2640529faddf",
          entityCode: "26855624000184",
          Infos: {
            item: "14936",
            quantity: "4",
            value: 7.11,
          },
        }),
      },
    },
    {
      event: {
        body: JSON.stringify({
          liveId: "c94f0038e5429e65337a2640529faddf",
          entityCode: "26855624000184",
          Infos:
            {
              item: "14936",
              quantity: "4",
              value: 7.11,
            },
        }),
        pathParameters: {},
        headers: {},
        httpMethod: "DELETE",
        ...defaultValueEvent,
      },
      output: {
        httpMethod: "DELETE",
        body: JSON.stringify({
          liveId: "c94f0038e5429e65337a2640529faddf",
          entityCode: "26855624000184",
          Infos: {
            item: "14936",
            quantity: "4",
            value: 7.11,
          },
        }),
      },
    },
    {
      event: {
        body: '',
        pathParameters: {},
        headers: {},
        httpMethod: "GET",
        ...defaultValueEvent,
      },
      output: {
          httpMethod: 'GET',
          sort: undefined,
          limit: undefined,
          page: undefined,
          columns: undefined,
          filters: undefined,
          onlyConstructor: undefined,
          onlyCount: undefined
        },
    }
  ];
  test.each(param)("Should return an object (no errors)", (param) => {
    expect(lambdaCrudHandler(param.event)).toStrictEqual(param.output);
  });
});


describe("lambdaCrudHandler", () => {
  const param: { event: APIGatewayEvent; }[] = [
  {
    event: {
      body: '',
      pathParameters: {},
      headers: {},
      httpMethod: "",
      ...defaultValueEvent,
    },
  }]
  test.each(param)("Should return an error", (param) => {
    expect(() => lambdaCrudHandler(param.event)).toThrow();
  });
})