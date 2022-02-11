import { HttpStatuses } from '../../src/http'
import {
  DynamooseEventsCrud,
  dynamooseCrudHandler,
  getDynamooseStatusCode,
  DynamooseOutputParams,
  DynamoObjectKeys,
  DynamooseCrudInputParams,
  DynamooseQueryParams,
  dynamooseQueryBuilder,
  prepareDynamoIndexes,
  DynamooseInputIndexes,
  mountDynamooseQuery
} from '../../src/dynamoose'
import { ModelType } from 'dynamoose/dist/General'
import { Document } from 'dynamoose/dist/Document'

describe('dynamooseCrudHandler', () => {
  const param: Array<{ crudInputParams: DynamooseCrudInputParams
    dynamooseObjectKeys: DynamoObjectKeys
    settings?: { events?: DynamooseEventsCrud }
    output: {}
  }> = [
    {
      crudInputParams: {
        httpMethod: 'GET',
        keys: { appId: 'local', roleId: 'admin' }
      },
      dynamooseObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      output: {
        method: 'get',
        dynamooseData: {
          appId: 'local',
          roleId: 'admin'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'POST',
        keys: { appId: 'local', roleId: 'admin' },
        entity: {
          description: 'ola amigos',
          name: 'Amigos'
        }
      },
      dynamooseObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      output: {
        method: 'create',
        dynamooseData: {
          appId: 'local',
          roleId: 'admin',
          description: 'ola amigos',
          name: 'Amigos'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'POST',
        keys: { appId: 'local' },
        entity: {
          description: 'ola amigos',
          name: 'Amigos'
        }
      },
      dynamooseObjectKeys: {
        hash: 'appId'
      },
      output: {
        method: 'create',
        dynamooseData: {
          appId: 'local',
          description: 'ola amigos',
          name: 'Amigos'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'PUT',
        keys: { appId: 'local' },
        entity: {
          description: 'ola amigos',
          name: 'Amigos'
        }
      },
      dynamooseObjectKeys: {
        hash: 'appId'
      },
      output: {
        method: 'update',
        dynamooseData: {
          appId: 'local',
          description: 'ola amigos',
          name: 'Amigos'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'DELETE',
        keys: { appId: 'local' },
        entity: {
        }
      },
      dynamooseObjectKeys: {
        hash: 'appId'
      },
      output: {
        method: 'delete',
        dynamooseData: {
          appId: 'local'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'GET',
        keys: { appId: 'local' },
        entity: {
        }
      },
      dynamooseObjectKeys: {
        hash: 'appId'
      },
      output: {
        method: 'get',
        dynamooseData: {
          appId: 'local'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'GET',
        keys: { appId: 'local' },
        entity: {
        }
      },
      dynamooseObjectKeys: {
        hash: 'appId'
      },
      output: {
        method: 'get',
        dynamooseData: {
          appId: 'local'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'PUT',
        keys: { appId: 'stage', roleId: 'amigos-da-catarina' },
        entity: {
          description: 'ola amigos',
          name: 'Amigos'
        }
      },
      dynamooseObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      output: {
        method: 'update',
        dynamooseData: {
          appId: 'stage',
          roleId: 'amigos-da-catarina',
          description: 'ola amigos',
          name: 'Amigos'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'DELETE',
        keys: { appId: 'stage', roleId: 'amigos-da-catarina' }
      },
      dynamooseObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      output: {
        method: 'delete',
        dynamooseData: {
          appId: 'stage',
          roleId: 'amigos-da-catarina'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'GET',
        keys: { appId: 'stage', roleId: 'amigos-da-catarina' }
      },
      dynamooseObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      output: {
        method: 'get',
        dynamooseData: {
          appId: 'stage',
          roleId: 'amigos-da-catarina'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'GET',
        keys: { appId: 'stage', roleId: 'amigos-da-catarina' },
        filters: { appId: 'eq', roleId: 'beginsWith' }
      },
      dynamooseObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      output: {
        method: 'query',
        dynamooseData: {
          appId: 'stage',
          roleId: 'amigos-da-catarina'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'GET',
        keys: { appId: 'stage', roleId: 'amigos-da-catarina' },
        filters: { }
      },
      dynamooseObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      output: {
        method: 'query',
        dynamooseData: {
          appId: 'stage',
          roleId: 'amigos-da-catarina'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'GET',
        keys: { appId: 'stage' },
        filters: { }
      },
      dynamooseObjectKeys: {
        hash: 'appId'
      },
      output: {
        method: 'query',
        dynamooseData: {
          appId: 'stage'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'PUT',
        keys: { appId: 'stage', roleId: 'amigos-da-catarina' },
        entity: {
          description: 'ola amigos',
          name: 'Amigos'
        }
      },
      dynamooseObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      output: {
        method: 'update',
        dynamooseData: {
          appId: 'stage',
          roleId: 'amigos-da-catarina',
          description: 'ola amigos',
          name: 'Amigos'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'POST',
        keys: { appId: 'local', roleId: 'admin' },
        entity: {
          description: 'ola amigos',
          name: 'Amigos'
        }
      },
      dynamooseObjectKeys: {
        hash: 'appId',
        range: 'roleId'
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
        dynamooseData: {
          createdAt: 1642505518316,
          appId: 'local',
          roleId: 'admin',
          description: 'ola amigos',
          name: 'Amigos'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'PUT',
        keys: { appId: 'local', roleId: 'admin' },
        entity: {
          description: 'ola amigos',
          name: 'Amigos'
        }
      },
      dynamooseObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      settings: {
        events: {
          onPut: (prismaInputParams) => {
            let { entity } = prismaInputParams
            if (!entity) entity = {}

            entity.createdAt = 1642505518316
            prismaInputParams.entity = entity

            return prismaInputParams
          }
        }
      },
      output: {
        method: 'update',
        dynamooseData: {
          createdAt: 1642505518316,
          appId: 'local',
          roleId: 'admin',
          description: 'ola amigos',
          name: 'Amigos'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'DELETE',
        keys: { appId: 'local', roleId: 'admin' },
        entity: {
          description: 'ola amigos',
          name: 'Amigos'
        }
      },
      dynamooseObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      settings: {
        events: {
          onDelete: (prismaInputParams) => {
            let { entity } = prismaInputParams
            if (!entity) entity = {}

            entity.createdAt = 1642505518316
            prismaInputParams.entity = entity

            return prismaInputParams
          }
        }
      },
      output: {
        method: 'delete',
        dynamooseData: {
          appId: 'local',
          roleId: 'admin'
        }
      }
    },
    {
      crudInputParams: {
        httpMethod: 'GET',
        keys: { appId: 'local', roleId: 'admin' },
        entity: {
          description: 'ola amigos',
          name: 'Amigos'
        }
      },
      dynamooseObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      settings: {
        events: {
          onGet: (prismaInputParams) => {
            let { entity } = prismaInputParams
            if (!entity) entity = {}

            entity.createdAt = 1642505518316
            prismaInputParams.entity = entity

            return prismaInputParams
          }
        }
      },
      output: {
        method: 'get',
        dynamooseData: {
          appId: 'local',
          roleId: 'admin'
        }
      }
    }
  ]
  test.each(param)('Should return a DynamooseCrudHandler object (no errors)', async (param) => {
    return expect(dynamooseCrudHandler(param.crudInputParams, param.dynamooseObjectKeys, param?.settings?.events)).resolves.toStrictEqual(param.output)
  })
})

describe('getDynamooseStatusCode', () => {
  const param: Array<{
    method: DynamooseOutputParams['method']
    dynamooseResult: any
    result: {statusCode: HttpStatuses, result: any }
  }> = [{
    method: 'create',
    dynamooseResult: {},
    result: { statusCode: 201, result: {} }
  }, {
    method: 'delete',
    dynamooseResult: {},
    result: { statusCode: 202, result: {} }
  }, {
    method: 'update',
    dynamooseResult: {},
    result: { statusCode: 202, result: {} }
  }, {
    method: 'get',
    dynamooseResult: 0,
    result: { statusCode: 202, result: 0 }
  }, {
    method: 'query',
    dynamooseResult: [{}],
    result: { statusCode: 200, result: { data: [{}], lastKey: undefined } }
  }, {
    method: 'query',
    dynamooseResult: [{}],
    result: { statusCode: 200, result: { data: [{}], lastKey: undefined } }
  }]
  test.each(param)('Should return a DynamooseStatusCode object (no errors)', (param) => {
    return expect(getDynamooseStatusCode(param.method, param.dynamooseResult)).toStrictEqual(param.result)
  })
})

describe('dynamooseQueryBuilder', () => {
  const param: Array<{
    requestFilters: {[key: string]: DynamooseQueryParams}
    requestKeys: {[key: string]: string}
    dynamoObjectKeys: DynamoObjectKeys
    result: {[key: string|number]: object}
  }> = [
    {
      requestFilters: { appId: 'eq', roleId: 'beginsWith' },
      requestKeys: { appId: 'local', roleId: 'turma' },
      dynamoObjectKeys: { hash: 'appId', range: 'roleId' },
      result: {
        appId: {
          eq: 'local'
        },
        roleId: {
          beginsWith: 'turma'
        }
      }
    },
    {
      requestFilters: { appId: 'eq', roleId: 'eq' },
      requestKeys: { appId: 'local', roleId: 'turma-do-dollynho' },
      dynamoObjectKeys: { hash: 'appId', range: 'roleId' },
      result: {
        appId: {
          eq: 'local'
        },
        roleId: {
          eq: 'turma-do-dollynho'
        }
      }
    },
    {
      requestFilters: { appId: 'eq', roleId: 'gt' },
      requestKeys: { appId: 'local', roleId: 'turma' },
      dynamoObjectKeys: { hash: 'appId', range: 'roleId' },
      result: {
        appId: {
          eq: 'local'
        },
        roleId: {
          gt: 'turma'
        }
      }
    }
  ]
  test.each(param)('Should return an object (no errors)', (param) => {
    return expect(dynamooseQueryBuilder(param.requestFilters, param.requestKeys, param.dynamoObjectKeys)).toStrictEqual(param.result)
  })
})

describe('prepareDynamoIndexes', () => {
  const param: Array<{
    indexes: DynamooseInputIndexes
    indexNameConcatString?: string
    result: DynamoObjectKeys
  }> = [
    {
      indexes: { hash: ['appId'], range: ['roleId'] },
      indexNameConcatString: 'And',
      result: {
        hash: 'appId',
        range: 'roleId'
      }
    },
    {
      indexes: { hash: ['appId', 'email'], range: ['roleId'] },
      result: {
        hash: 'appIdEmail',
        range: 'roleId'
      }
    },
    {
      indexes: { hash: ['appId', 'email'], range: ['roleId'] },
      indexNameConcatString: 'And',
      result: {
        hash: 'appIdAndEmail',
        range: 'roleId'
      }
    },
    {
      indexes: { hash: ['appId', 'roleId'], range: ['email'] },
      indexNameConcatString: 'Join',
      result: {
        hash: 'appIdJoinRoleId',
        range: 'email'
      }
    },
    {
      indexes: { hash: ['appId', 'email'], range: ['roleId', 'name'] },
      indexNameConcatString: 'And',
      result: {
        hash: 'appIdAndEmail',
        range: 'roleIdAndName'
      }
    },
    {
      indexes: { hash: ['appId', 'email'] },
      indexNameConcatString: 'And',
      result: {
        hash: 'appIdAndEmail'
      }
    }
  ]
  test.each(param)('Should return an object containing the created Dynamo Indexes object (no errors)', (param) => {
    return expect(prepareDynamoIndexes(param.indexes, param?.indexNameConcatString)).toStrictEqual(param.result)
  })
})

describe('mountDynamooseQuery', () => {
  const param: Array<{
    crudInputParams: DynamooseCrudInputParams
    dynamoObjectKeys: DynamoObjectKeys
    dynamooseModel: object
    result: object
  }> = [
    {
      crudInputParams: {
        httpMethod: 'GET',
        keys: { appId: 'local', roleId: 'admin' },
        filters: { appId: 'eq', roleId: 'beginsWith' }
      },
      dynamoObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      dynamooseModel: { query: () => { return { hash: 'appId', range: 'roleId' } } },
      result: { hash: 'appId', range: 'roleId', settings: { } }
    },
    {
      crudInputParams: {
        httpMethod: 'GET',
        keys: { appId: 'local', roleId: 'admin' },
        filters: { appId: 'eq', roleId: 'beginsWith' },
        limit: '2'
      },
      dynamoObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      dynamooseModel: {
        query: () => { return { hash: 'appId', range: 'roleId' } }
      },
      result: { hash: 'appId', range: 'roleId', settings: { limit: 2 } }
    },
    {
      crudInputParams: {
        httpMethod: 'GET',
        keys: { appId: 'local', roleId: 'admin' },
        filters: { appId: 'eq', roleId: 'beginsWith' },
        page: '{ "appId": "local", "roleId": "amigos-da-lavinia" }'
      },
      dynamoObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      dynamooseModel: {
        query: () => { return { hash: 'appId', range: 'roleId' } }
      },
      result: { hash: 'appId', range: 'roleId', settings: { startAt: { appId: 'local', roleId: 'amigos-da-lavinia' } } }
    },
    {
      crudInputParams: {
        httpMethod: 'GET',
        keys: { appId: 'local', roleId: 'admin' },
        filters: { appId: 'eq', roleId: 'beginsWith' },
        sort: 'ascending'
      },
      dynamoObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      dynamooseModel: {
        query: () => { return { hash: 'appId', range: 'roleId' } }
      },
      result: { hash: 'appId', range: 'roleId', settings: { sort: 'ascending' } }
    },
    {
      crudInputParams: {
        httpMethod: 'GET',
        keys: { appId: 'local', roleId: 'admin' },
        filters: { appId: 'eq', roleId: 'beginsWith' },
        onlyCount: true
      },
      dynamoObjectKeys: {
        hash: 'appId',
        range: 'roleId'
      },
      dynamooseModel: {
        query: () => { return { hash: 'appId', range: 'roleId' } }
      },
      result: { hash: 'appId', range: 'roleId', settings: { count: true } }
    }
  ]
  test.each(param)('Should return an object containing the created Dynamo Indexes object (no errors)', (param) => {
    return expect(mountDynamooseQuery(param.crudInputParams, param.dynamoObjectKeys, param.dynamooseModel as ModelType<Document>)).toStrictEqual(param.result)
  })
})
