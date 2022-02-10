import {
  EventFunctionType,
  EventsCrud,
  PrismaOutputParams,
  settingsCrud
} from '.'
import { CrudInputParams } from '../lambda'
import { HttpStatuses } from '..'
import { isNumber } from './../number/index'

export const prismaBuilderParameters = async (prismaInputParams: CrudInputParams,
  { events, settings }: {
    events?: EventsCrud
    settings?: settingsCrud
  } = {}
): Promise<PrismaOutputParams> => {
  switch (prismaInputParams.httpMethod) {
    case 'GET':
      return getCase(prismaInputParams, events?.onGet)

    case 'POST':
      return postCase(prismaInputParams, events?.onPost)

    case 'PUT':
      return putCase(prismaInputParams, events?.onPut, settings)

    case 'DELETE':
      return deleteCase(prismaInputParams, events?.onDelete, settings)
  }
}

const deleteCase = async (prismaInputParams: CrudInputParams, event?: EventFunctionType, settings?: settingsCrud): Promise<PrismaOutputParams> => {
  const updatedCrudInputParams: CrudInputParams = event ? await event(prismaInputParams) : prismaInputParams
  updatedCrudInputParams.keys = formatEntitiesKeys(updatedCrudInputParams.keys, settings)

  return {
    method: 'delete',
    prismaParams: {
      where: {
        ...updatedCrudInputParams.keys
      }
    }
  }
}

const putCase = async (prismaInputParams: CrudInputParams, event?: EventFunctionType, settings?: settingsCrud): Promise<PrismaOutputParams> => {
  const updatedCrudInputParams: CrudInputParams = event ? await event(prismaInputParams) : prismaInputParams
  updatedCrudInputParams.keys = formatEntitiesKeys(updatedCrudInputParams.keys, settings)

  return {
    method: 'update',
    prismaParams: {
      where: {
        ...updatedCrudInputParams.keys,
        ...updatedCrudInputParams.filters
      },
      data: {
        jsonData: updatedCrudInputParams.entity
      }
    }
  }
}

const postCase = async (prismaInputParams: CrudInputParams, event?: EventFunctionType): Promise<PrismaOutputParams> => {
  const updatedCrudInputParams: CrudInputParams = event ? await event(prismaInputParams) : prismaInputParams
  updatedCrudInputParams.keys = formatEntitiesKeys(updatedCrudInputParams.keys)

  return {
    method: 'create',
    prismaParams: {
      data: {
        jsonData: updatedCrudInputParams.entity,
        ...updatedCrudInputParams.keys
      }
    }
  }
}

const getCase = async (prismaInputParams: CrudInputParams, event?: EventFunctionType): Promise<PrismaOutputParams> => {
  const updatedCrudInputParams: CrudInputParams = event ? await event(prismaInputParams) : prismaInputParams
  updatedCrudInputParams.keys = formatEntitiesKeys(updatedCrudInputParams.keys)

  return {
    method: updatedCrudInputParams.onlyCount ? 'count' : 'findMany', // todo implement findUnique
    prismaParams: {
      take: updatedCrudInputParams.limit ? Number(updatedCrudInputParams.limit) : undefined,
      skip: updatedCrudInputParams.page ? (Number(updatedCrudInputParams.page) - 1) * Number(updatedCrudInputParams.limit) : undefined,
      select: updatedCrudInputParams.columns && JSON.parse(updatedCrudInputParams.columns),
      where: {
        ...updatedCrudInputParams.keys,
        ...updatedCrudInputParams.filters
      }
    }
  }
}

export const getPrismaStatusCode = <prismaEntity>(method: PrismaOutputParams['method'], prismaResult: prismaEntity | number | prismaEntity[]): {
  statusCode: HttpStatuses
  result: prismaEntity | number | prismaEntity[]
} => {
  switch (method) {
    case 'create':
      return {
        statusCode: HttpStatuses.created,
        result: prismaResult
      }
    case 'delete':
      return {
        statusCode: HttpStatuses.accepted,
        result: prismaResult
      }
    case 'update':
      return {
        statusCode: HttpStatuses.accepted,
        result: prismaResult
      }
    case 'count':
      return {
        statusCode: HttpStatuses.success,
        result: prismaResult
      }
    case 'findMany': {
      return {
        statusCode: HttpStatuses.success,
        result: prismaResult
      }
    }
  }
}

export const formatEntitiesKeys = (keys?: {[key: string]: string|number}, settings?: settingsCrud): {[key: string]: string|number|{[key: string]: string|number}} => {
  const formattedKeys: {[key: string]: string|number} = keys ?? {}
  if (keys) {
    for (const key in keys) {
      if (Object.prototype.hasOwnProperty.call(keys, key)) {
        const keyValue = keys[key]
        if (isNumber(keyValue)) { formattedKeys[key] = Number(keyValue) }
      }
    }
  }

  if (settings?.joinKeys) {
    const keysArray = Object.keys(formattedKeys)
    const keysInJoin = keysArray.join('_')
    return {
      [keysInJoin]: formattedKeys
    }
  }
  return formattedKeys
}
