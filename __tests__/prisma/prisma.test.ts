import {
  EventsCrud,
  SettingsCrud,
  prismaBuilderParameters,
  getPrismaStatusCode,
  PrismaOutputParams,
  BlockedMethods
} from '../../src/prisma'
import { HttpStatuses } from '../../src/http'
import { CrudInputParams } from '../../src/lambda'

describe('prismaBuilderParameters', () => {
  const param: Array<{ prismaInputParams: CrudInputParams
    settings?: { events?: EventsCrud, settings?: SettingsCrud }
    output: {}
  }> = [
    {
      prismaInputParams: {
        httpMethod: 'GET',
        sort: '{"appId":"asc"}'
      },
      output: {
        method: 'findMany',
        prismaParams: {
          select: undefined,
          orderBy: { appId: 'asc' },
          skip: undefined,
          take: undefined,
          where: {}
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'GET',
        filters: '{"appId":"local"}'
      },
      output: {
        method: 'findMany',
        prismaParams: {
          select: undefined,
          skip: undefined,
          take: undefined,
          where: { appId: 'local' }
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'GET',
        columns: '{"appId":true}'
      },
      output: {
        method: 'findMany',
        prismaParams: {
          select: { appId: true },
          orderBy: { appId: 'asc' },
          skip: undefined,
          take: undefined,
          where: {}
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'GET'
      },
      output: {
        method: 'findMany',
        prismaParams: {
          select: undefined,
          orderBy: undefined,
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
      output: {
        method: 'create',
        prismaParams: {
          data: { jsonData: undefined }
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'GET',
        onlyCount: true
      },
      output: {
        method: 'count',
        prismaParams: {
          select: undefined,
          orderBy: undefined,
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
      output: {
        method: 'update',
        prismaParams: {
          data: { jsonData: undefined },
          where: {}
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'PUT',
        keys: {
          appId: 'local',
          templateId: 77
        }
      },
      settings: { settings: { joinKeys: true } },
      output: {
        method: 'update',
        prismaParams: {
          data: { jsonData: undefined },
          where: {
            appId_templateId: {
              appId: 'local',
              templateId: 77
            }
          }
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'PUT',
        keys: {
          appId: 'local',
          templateId: 77
        }
      },
      output: {
        method: 'update',
        prismaParams: {
          data: { jsonData: undefined },
          where: {
            appId: 'local',
            templateId: 77
          }
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'POST',
        entity: {}
      },
      settings: {
        events: {
          onPost: (prismaInputParams) => {
            let { entity } = prismaInputParams
            if (!entity) entity = {}

            entity.createdAt = 1642505518316
            prismaInputParams.entity = entity

            return prismaInputParams
          }
        }
      },
      output: {
        method: 'create',
        prismaParams: {
          data: {
            jsonData: { createdAt: 1642505518316 }
          }
        }
      }
    },
    {
      prismaInputParams: {
        httpMethod: 'GET',
        onlyCount: true
      },
      settings: {
        events: {
          onGet: (prismaInputParams) => {
            prismaInputParams.limit = '77'
            prismaInputParams.page = '77'
            return prismaInputParams
          }
        }
      },
      output: {
        method: 'count',
        prismaParams: {
          select: undefined,
          orderBy: undefined,
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
      settings: {
        events: {
          onGet: (prismaInputParams) => {
            prismaInputParams.columns = ['appId']
            return prismaInputParams
          }
        }
      },
      output: {
        method: 'findMany',
        prismaParams: {
          select: ['appId'],
          orderBy: undefined,
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
      settings: {
        events: {
          onDelete: (prismaInputParams) => {
            prismaInputParams.keys = {
              appId: 'amc',
              itemId: 1
            }
            return prismaInputParams
          }
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
      settings: {
        events: {
          onPut: (prismaInputParams) => {
            prismaInputParams.entity = {}
            return prismaInputParams
          }
        }
      },
      output: {
        method: 'update',
        prismaParams: {
          data: { jsonData: {} },
          where: {}
        }
      }
    }
  ]
  test.each(param)('Should return an object (no errors)', async (param) => {
    return expect(prismaBuilderParameters(param.prismaInputParams, param?.settings)).resolves.toStrictEqual(param.output)
  })
})

describe('throws prismaBuilderParameters', () => {
  const param: Array<{
    prismaInputParams: CrudInputParams
    blockedMethods: BlockedMethods
    throw: object
  }> = [
    {
      prismaInputParams: {
        httpMethod: 'DELETE'
      },
      blockedMethods: {
        DELETE: true
      },
      throw: { message: 'The server does not support the functionality required to fulfill the request', statusCode: 501 }
    },
    {
      prismaInputParams: {
        httpMethod: 'PUT'
      },
      blockedMethods: {
        PUT: ''
      },
      throw: { message: 'The server does not support the functionality required to fulfill the request', statusCode: 501 }
    },
    {
      prismaInputParams: {
        httpMethod: 'GET'
      },
      blockedMethods: {
        GET: 'Não de get plz!!!'
      },
      throw: { message: 'Não de get plz!!!', statusCode: 501 }
    }
  ]
  test.each(param)('Should return an throw', async (param) => expect(
    prismaBuilderParameters(param.prismaInputParams, { ...param })
  ).rejects.toStrictEqual(param.throw))
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
    result: { statusCode: 200, result: [] }
  }]
  test.each(param)('Should return an object (no errors)', (param) => {
    return expect(getPrismaStatusCode(param.prismaMethod, param.prismaResult)).toStrictEqual(param.result)
  })
})
