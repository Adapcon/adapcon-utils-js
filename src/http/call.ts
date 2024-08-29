import axios, { type AxiosRequestConfig } from 'axios'

type Options = AxiosRequestConfig & {
  retryCount?: number
  timeoutBetweenRetries?: number
}

/*
  * @description This function makes an HTTP request to the given URL with the given options.
  * If the request fails, the function will retry the request up to the given number
  * of times after the given timout.
*/
export async function callHttpWithRetry<T> (
  url: string,
  options: Options
): Promise<T | undefined> {
  const { retryCount, timeoutBetweenRetries, ...axiosOptions } = options
  const retries = retryCount ?? 2

  for (let i = 0; i < retries; i++) {
    try {
      const { data } = await axios(url, axiosOptions)
      return data as T
    } catch (error) {
      if (i === retries - 1) {
        throw error
      }

      await new Promise(resolve => setTimeout(resolve, timeoutBetweenRetries ?? 500))
    }
  }
}
