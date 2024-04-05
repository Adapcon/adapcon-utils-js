import {
  EventFunctionType,
  EventsCrud,
  PrismaOutputParams,
  SettingsCrud,
  BlockedMethods,
  PrismaInputParams
} from '.'
import {
  CrudInputParams,
  CrudHttpMethods
} from '../lambda'
import { HttpStatuses } from '..'
import { isNumber } from './../number'
import { error } from './../error'
import { HttpMessages } from './../http'

export const prismaBuilderParameters = async (prismaInputParams: CrudInputParams,
  { events, settings, blockedMethods }: {
    events?: EventsCrud
    settings?: SettingsCrud
    blockedMethods?: BlockedMethods
  } = {}
): Promise<PrismaOutputParams> => {
  verifyBlockedMethods(prismaInputParams.httpMethod, blockedMethods)

  const updatedCrudInputParams = prismaInputParams as PrismaInputParams
  if (updatedCrudInputParams.filters && typeof updatedCrudInputParams.filters === 'string') { updatedCrudInputParams.filters = JSON.parse(updatedCrudInputParams.filters) }
  if (updatedCrudInputParams.columns && typeof updatedCrudInputParams.columns === 'string') { updatedCrudInputParams.columns = JSON.parse(updatedCrudInputParams.columns) }
  if (updatedCrudInputParams.sort && typeof updatedCrudInputParams.sort === 'string') { updatedCrudInputParams.sort = JSON.parse(updatedCrudInputParams.sort) }

  switch (updatedCrudInputParams.httpMethod) {
    case 'GET':
      return getCase(updatedCrudInputParams, events?.onGet)

    case 'POST':
      return postCase(updatedCrudInputParams, events?.onPost)

    case 'PUT':
      return putCase(updatedCrudInputParams, events?.onPut, settings)

    case 'DELETE':
      return deleteCase(updatedCrudInputParams, events?.onDelete, settings)
  }
}

const deleteCase = async (prismaInputParams: PrismaInputParams, event?: EventFunctionType, settings?: SettingsCrud): Promise<PrismaOutputParams> => {
  const updatedCrudInputParams: PrismaInputParams = event ? await event(prismaInputParams) : prismaInputParams
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

const putCase = async (prismaInputParams: PrismaInputParams, event?: EventFunctionType, settings?: SettingsCrud): Promise<PrismaOutputParams> => {
  const updatedCrudInputParams: PrismaInputParams = event ? await event(prismaInputParams) : prismaInputParams
  updatedCrudInputParams.keys = formatEntitiesKeys(updatedCrudInputParams.keys, settings)

  return {
    method: 'update',
    prismaParams: {
      where: {
        ...updatedCrudInputParams.keys,
        ...updatedCrudInputParams.filters
      },
      data: {
        ...updatedCrudInputParams.entity
      }
    }
  }
}

const postCase = async (prismaInputParams: PrismaInputParams, event?: EventFunctionType): Promise<PrismaOutputParams> => {
  const updatedCrudInputParams: PrismaInputParams = event ? await event(prismaInputParams) : prismaInputParams
  updatedCrudInputParams.keys = formatEntitiesKeys(updatedCrudInputParams.keys)

  return {
    method: 'create',
    prismaParams: {
      data: {
        ...updatedCrudInputParams.entity,
        ...updatedCrudInputParams.keys
      }
    }
  }
}

const getCase = async (prismaInputParams: PrismaInputParams, event?: EventFunctionType): Promise<PrismaOutputParams> => {
  const updatedCrudInputParams: PrismaInputParams = event ? await event(prismaInputParams) : prismaInputParams
  updatedCrudInputParams.keys = formatEntitiesKeys(updatedCrudInputParams.keys)

  return {
    method: updatedCrudInputParams.onlyCount ? 'count' : 'findMany', // todo implement findUnique
    prismaParams: {
      take: updatedCrudInputParams.limit ? Number(updatedCrudInputParams.limit) : undefined,
      skip: updatedCrudInputParams.page ? (Number(updatedCrudInputParams.page) - 1) * Number(updatedCrudInputParams.limit) : undefined,
      select: updatedCrudInputParams.columns,
      orderBy: updatedCrudInputParams.sort,
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

export const formatEntitiesKeys = (
  keys?: {[key: string]: string|number},
  settings?: SettingsCrud
): {
  [key: string]: string|number|{
    [key: string]: string|number
  }
} => {
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
    const keysInJoin = settings.keysList.join('_')
    return {
      [keysInJoin]: formattedKeys
    }
  }
  return formattedKeys
}

const verifyBlockedMethods = (httpMethod: CrudHttpMethods, blockedMethods?: BlockedMethods) => {
  if (blockedMethods) {
    if (blockedMethods[httpMethod] !== undefined) {
      const message = typeof blockedMethods[httpMethod] === 'string'
        ? blockedMethods[httpMethod] as string
        : ''
      const blockMessage = message.length
        ? message
        : HttpMessages.notImplemented

      throw error(HttpStatuses.notImplemented, blockMessage)
    }
  }
}
