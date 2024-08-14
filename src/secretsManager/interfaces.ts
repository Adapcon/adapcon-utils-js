export interface AccessKey {
  SecretString?: string
}

export interface AccessKeyParam {
  region?: string
  serviceSecretArn?: string
  isOffline?: boolean
}
