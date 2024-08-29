import axios, { type AxiosRequestConfig } from 'axios'

type Options = AxiosRequestConfig & { retryCount?: number, timeoutBetweenRetries?: number }

export async function callHttpWithRetry (url: string, options: Options) {
  const { retryCount, timeoutBetweenRetries, ...axiosOptions } = options
  const retries = retryCount ?? 2

  for (let i = 0; i < retries; i++) {
    try {
      const { data } = await axios(url, axiosOptions)
      return data
    } catch (error) {
      if (i === retries - 1) {
        throw error
      }

      await new Promise(resolve => setTimeout(resolve, timeoutBetweenRetries ?? 500))
    }
  }
}
