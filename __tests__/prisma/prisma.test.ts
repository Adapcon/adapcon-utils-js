import { EventsCrud, prismaBuilderParameters, PrismaInputParams } from '../../src/prisma'

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
    }
  ]
  test.each(param)('Should return an object (no errors)', async (param) => {
    return expect(prismaBuilderParameters(param.prismaInputParams, param.events)).resolves.toStrictEqual(param.output)
  })
})
