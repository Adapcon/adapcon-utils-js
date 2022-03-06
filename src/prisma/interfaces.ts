
import type { CrudHttpMethods } from '../lambda'

export type PrismaInputParams = {
  httpMethod: CrudHttpMethods
  sort?: object
  limit?: string
  page?: string
  columns?: object
  onlyCount?: boolean
  entity?: {[key: string]: any}
  filters?: object | []
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

export type EventFunctionType = (prismaInputParams: PrismaInputParams) => PrismaInputParams | Promise<PrismaInputParams>

export type SettingsCrud = {
  joinKeys: boolean
}

export type BlockedMethods = {
  [methodMessage in CrudHttpMethods]?: string | boolean
}
