export const setTimeoutPromise = async (callback, timeout): Promise<any> => new Promise((resolve, reject) => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setTimeout(async () => {
    try {
      const res = await callback()
      return resolve(res)
    } catch (err) {
      reject(err)
    }
  }, timeout)
})
