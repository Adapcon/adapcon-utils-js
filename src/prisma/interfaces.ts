
import type { CrudInputParams, CrudHttpMethods } from '../lambda'

export type PrismaInputParams = {
  httpMethod: CrudHttpMethods
  sort?: string | object
  limit?: string
  page?: string
  columns?: string | object
  onlyCount?: boolean
  entity?: {[key: string]: any}
  filters?: string | object | []
  keys?: {[key: string]: any}
  customParameters?: {[key: string]: any}
}

export type PrismaOutputParams<prismaParamsType = {}> = {
  method: 'count' | 'findMany' | 'create' | 'update' | 'delete'
  prismaParams: prismaParamsType
}

export type EventsCrud = {
  onPost?: EventFunctionType
  onPut?: EventFunctionType
  onDelete?: EventFunctionType
  onGet?: EventFunctionType
}

export type EventFunctionType = (prismaInputParams: CrudInputParams) => CrudInputParams

export type SettingsCrud = {
  joinKeys: boolean
}

export type BlockedMethods = {
  [methodMessage in CrudHttpMethods]?: string | boolean
}
