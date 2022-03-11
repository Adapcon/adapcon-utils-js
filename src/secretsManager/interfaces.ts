export interface AccessKey {
  accessKeyId: string
  secretAccessKey: string
  region?: string
}

export interface AccessKeyParam {
  region?: string
  serviceSecretArn?: string
  isOffline?: boolean
}
