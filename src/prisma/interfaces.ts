export type PrismaInputParams = {
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE'
  sort?: string
  limit?: string
  page?: string
  columns?: string
  onlyCount?: boolean
  entity?: {[key: string]: any}
  filters?: {[key: string]: any}
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

export type EventFunctionType = (prismaInputParams: PrismaInputParams) => PrismaInputParams
