export function createElectronAdapter() {
  return function electronAdapter(config) {
    return new Promise((resolve, reject) => {
      // 清理配置，移除不可序列化的字段
      const cleanConfig = {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
        params: config.params,
        timeout: config.timeout,
        responseType: config.responseType,
        auth: config.auth,
        proxy: config.proxy,
        maxRedirects: config.maxRedirects,
        // validateStatus: config.validateStatus ? config.validateStatus.toString() : undefined,
      }

      // 使用 electron 的 IPC 发送请求
      window.electronAPI.httpRequest(cleanConfig)
        .then((response) => {
          // 构造 axios 期望的响应格式
          const axiosResponse = {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            config,
            request: {},
          }

          resolve(axiosResponse)
        })
        .catch((error) => {
          // 构造 axios 期望的错误格式
          const axiosError: Error & { code?: number, response?: any, config?: any } = new Error(error.message)
          axiosError.code = error.code
          axiosError.response = error.status
            ? {
                data: error.data,
                status: error.status,
                statusText: error.statusText,
                headers: error.headers,
              }
            : undefined
          axiosError.config = config
          reject(axiosError)
        })
    })
  }
}
