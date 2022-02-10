import { HttpStatuses } from '../../src/http'
import {
  DynamooseEventsCrud,
  dynamooseCrudHandler,
  getDynamooseStatusCode,
  DynamooseOutputParams,
  DynamoObjectKeys
} from '../../src/dynamoose'
import {
  CrudInputParams
} from '../../src/lambda'
// import { HttpStatuses } from '../../src/http'

describe('dynamooseCrudHandler', () => {
  const param: Array<{ crudInputParams: CrudInputParams
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
    }
  ]
  test.each(param)('Should return an object (no errors)', async (param) => {
    return expect(dynamooseCrudHandler(param.crudInputParams, param.dynamooseObjectKeys)).resolves.toStrictEqual(param.output)
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
  }]
  test.each(param)('Should return an object (no errors)', (param) => {
    return expect(getDynamooseStatusCode(param.method, param.dynamooseResult)).toStrictEqual(param.result)
  })
})
