import {
  EventsCrud,
  prismaBuilderParameters,
  PrismaInputParams,
  getPrismaStatusCode,
  PrismaOutputParams
} from '../../src/prisma'
import { HttpStatuses } from '../../src/http'

describe('prismaBuilderParameters', () => {
  const param: Array<{ prismaInputParams: PrismaInputParams
    events: EventsCrud
    output: {}
  }> = [
    {
      prismaInputParams: {
        httpMethod: 'GET'
      },
      events: {},
      output: {
        method: 'findMany',
        prismaParams: {
          select: undefined,
          skip: undefined,
          take: undefined,
          where: {}
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'POST'
      },
      events: {},
      output: {
        method: 'create',
        prismaParams: {
          data: { jsondata: undefined }
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'GET',
        onlyCount: true
      },
      events: {},
      output: {
        method: 'count',
        prismaParams: {
          select: undefined,
          skip: undefined,
          take: undefined,
          where: {}
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'DELETE'
      },
      events: {},
      output: {
        method: 'delete',
        prismaParams: {
          where: {}
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'PUT'
      },
      events: {},
      output: {
        method: 'update',
        prismaParams: {
          data: { jsondata: undefined },
          where: {}
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'POST',
        entity: {}
      },
      events: {
        onPost: (prismaInputParams) => {
          let { entity } = prismaInputParams
          if (!entity) entity = {}

          entity.createdAt = 1642505518316
          prismaInputParams.entity = entity

          return prismaInputParams
        }
      },
      output: {
        method: 'create',
        prismaParams: {
          data: {
            jsondata: { createdAt: 1642505518316 }
          }
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'GET',
        onlyCount: true
      },
      events: {
        onGet: (prismaInputParams) => {
          prismaInputParams.limit = '77'
          prismaInputParams.page = '77'
          return prismaInputParams
        }
      },
      output: {
        method: 'count',
        prismaParams: {
          select: undefined,
          skip: 5852,
          take: 77,
          where: {}
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'GET'
      },
      events: {
        onGet: (prismaInputParams) => {
          prismaInputParams.columns = '["appId"]'
          return prismaInputParams
        }
      },
      output: {
        method: 'findMany',
        prismaParams: {
          select: ['appId'],
          skip: undefined,
          take: undefined,
          where: {}
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'DELETE'
      },
      events: {
        onDelete: (prismaInputParams) => {
          prismaInputParams.keys = {
            appId: 'amc',
            itemId: 1
          }
          return prismaInputParams
        }
      },
      output: {
        method: 'delete',
        prismaParams: {
          where: {
            appId: 'amc',
            itemId: 1
          }
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'PUT'
      },
      events: {
        onPut: (prismaInputParams) => {
          prismaInputParams.entity = {}
          return prismaInputParams
        }
      },
      output: {
        method: 'update',
        prismaParams: {
          data: { jsondata: {} },
          where: {}
        }
      }
    }
  ]
  test.each(param)('Should return an object (no errors)', async (param) => {
    return expect(prismaBuilderParameters(param.prismaInputParams, param.events)).resolves.toStrictEqual(param.output)
  })
})

describe('getPrismaStatusCode', () => {
  const param: Array<{
    prismaMethod: PrismaOutputParams['method']
    prismaResult: any
    result: {statusCode: HttpStatuses, result: any }
  }> = [{
    prismaMethod: 'create',
    prismaResult: {},
    result: { statusCode: 201, result: {} }
  }, {
    prismaMethod: 'delete',
    prismaResult: {},
    result: { statusCode: 202, result: {} }
  }, {
    prismaMethod: 'update',
    prismaResult: {},
    result: { statusCode: 202, result: {} }
  }, {
    prismaMethod: 'count',
    prismaResult: 0,
    result: { statusCode: 200, result: 0 }
  }, {
    prismaMethod: 'findMany',
    prismaResult: [{}],
    result: { statusCode: 200, result: [{}] }
  }, {
    prismaMethod: 'findMany',
    prismaResult: [],
    result: { statusCode: 204, result: [] }
  }]
  test.each(param)('Should return an object (no errors)', (param) => {
    return expect(getPrismaStatusCode(param.prismaMethod, param.prismaResult)).toStrictEqual(param.result)
  })
})
