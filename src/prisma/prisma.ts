import {
  EventFunctionType,
  EventsCrud,
  PrismaInputParams,
  PrismaOutputParams
} from '.'
import { HttpStatuses } from '..'

export const prismaBuilderParameters = async (prismaInputParams: PrismaInputParams, events: EventsCrud): Promise<PrismaOutputParams> => {
  switch (prismaInputParams.httpMethod) {
    case 'GET':
      return getCase(prismaInputParams, events.onGet)

    case 'POST':
      return postCase(prismaInputParams, events.onPost)

    case 'PUT':
      return putCase(prismaInputParams, events.onPut)

    case 'DELETE':
      return deleteCase(prismaInputParams, events.onDelete)
  }
}

const deleteCase = async (prismaInputParams: PrismaInputParams, event?: EventFunctionType): Promise<PrismaOutputParams> => {
  const updatedPrismaInputParams: PrismaInputParams = event ? await event(prismaInputParams) : prismaInputParams
  return {
    method: 'delete',
    prismaParams: {
      where: {
        ...updatedPrismaInputParams.keys
      }
    }
  }
}

const putCase = async (prismaInputParams: PrismaInputParams, event?: EventFunctionType): Promise<PrismaOutputParams> => {
  const updatedPrismaInputParams: PrismaInputParams = event ? await event(prismaInputParams) : prismaInputParams
  return {
    method: 'update',
    prismaParams: {
      where: {
        ...updatedPrismaInputParams.keys,
        ...updatedPrismaInputParams.filters
      },
      data: {
        jsondata: updatedPrismaInputParams.entity
      }
    }
  }
}

const postCase = async (prismaInputParams: PrismaInputParams, event?: EventFunctionType): Promise<PrismaOutputParams> => {
  const updatedPrismaInputParams: PrismaInputParams = event ? await event(prismaInputParams) : prismaInputParams
  return {
    method: 'create',
    prismaParams: {
      data: {
        jsondata: updatedPrismaInputParams.entity
      }
    }
  }
}

const getCase = async (prismaInputParams: PrismaInputParams, event?: EventFunctionType): Promise<PrismaOutputParams> => {
  const updatedPrismaInputParams: PrismaInputParams = event ? await event(prismaInputParams) : prismaInputParams
  return {
    method: updatedPrismaInputParams.onlyCount ? 'count' : 'findMany',
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

export const getPrismaStatusCode = (method: PrismaOutputParams['method']): HttpStatuses => {
  switch (method) {
    case 'create':
      return HttpStatuses.created
    case 'delete':
      return HttpStatuses.accepted
    case 'update':
      return HttpStatuses.accepted
    case 'count':
      return HttpStatuses.success
    case 'findMany':
      return HttpStatuses.success

    default:
      return HttpStatuses.internalError
  }
}
