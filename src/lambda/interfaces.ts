export interface Error {
  status?: number
  statusCode?: number
  error?: any
  message?: string
}

export type CrudInputParams = {
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
