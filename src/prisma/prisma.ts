import {
  EventFunctionType,
  EventsCrud,
  PrismaInputParams,
  PrismaOutputParams,
  settingsCrud
} from '.'
import { HttpStatuses } from '..'
import { isNumber } from './../number/index'

export const prismaBuilderParameters = async (prismaInputParams: PrismaInputParams,
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

const deleteCase = async (prismaInputParams: PrismaInputParams, event?: EventFunctionType, settings?: settingsCrud): Promise<PrismaOutputParams> => {
  const updatedPrismaInputParams: PrismaInputParams = event ? await event(prismaInputParams) : prismaInputParams
  updatedPrismaInputParams.keys = formatEntitiesKeys(updatedPrismaInputParams.keys, settings)

  return {
    method: 'delete',
    prismaParams: {
      where: {
        ...updatedPrismaInputParams.keys
      }
    }
  }
}

const putCase = async (prismaInputParams: PrismaInputParams, event?: EventFunctionType, settings?: settingsCrud): Promise<PrismaOutputParams> => {
  const updatedPrismaInputParams: PrismaInputParams = event ? await event(prismaInputParams) : prismaInputParams
  updatedPrismaInputParams.keys = formatEntitiesKeys(updatedPrismaInputParams.keys, settings)

  return {
    method: 'update',
    prismaParams: {
      where: {
        ...updatedPrismaInputParams.keys,
        ...updatedPrismaInputParams.filters
      },
      data: {
        jsonData: updatedPrismaInputParams.entity
      }
    }
  }
}

const postCase = async (prismaInputParams: PrismaInputParams, event?: EventFunctionType): Promise<PrismaOutputParams> => {
  const updatedPrismaInputParams: PrismaInputParams = event ? await event(prismaInputParams) : prismaInputParams
  updatedPrismaInputParams.keys = formatEntitiesKeys(updatedPrismaInputParams.keys)

  return {
    method: 'create',
    prismaParams: {
      data: {
        jsonData: updatedPrismaInputParams.entity,
        ...updatedPrismaInputParams.keys
      }
    }
  }
}

const getCase = async (prismaInputParams: PrismaInputParams, event?: EventFunctionType): Promise<PrismaOutputParams> => {
  const updatedPrismaInputParams: PrismaInputParams = event ? await event(prismaInputParams) : prismaInputParams
  updatedPrismaInputParams.keys = formatEntitiesKeys(updatedPrismaInputParams.keys)

  return {
    method: updatedPrismaInputParams.onlyCount ? 'count' : 'findMany', // todo implement findUnique
    prismaParams: {
      take: updatedPrismaInputParams.limit ? Number(updatedPrismaInputParams.limit) : undefined,
      skip: updatedPrismaInputParams.page ? (Number(updatedPrismaInputParams.page) - 1) * Number(updatedPrismaInputParams.limit) : undefined,
      select: updatedPrismaInputParams.columns && JSON.parse(updatedPrismaInputParams.columns),
      where: {
        ...updatedPrismaInputParams.keys,
        ...updatedPrismaInputParams.filters
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

const formatEntitiesKeys = (keys?: {[key: string]: string|number}, settings?: settingsCrud): {[key: string]: string|number|{[key: string]: string|number}} => {
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
