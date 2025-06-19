import type { BackendResponse } from './types'
import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import vueHook from 'alova/vue'

// 这里可以根据实际情况配置 baseURL、请求头等
function createAlovaInstance(baseUrl: string) {
  return createAlova({
    baseURL: baseUrl, // 替换为你的后端地址
    requestAdapter: adapterFetch(),
    statesHook: vueHook,
    timeout: 10000,
    // 可选：全局请求/响应拦截
    beforeRequest(config) {
    // 比如加 token
    // config.headers.Authorization = 'Bearer ' + token
      return config
    },
    responded: {
      onSuccess: async (response) => {
        if (response.status >= 200 && response.status < 300) {
          const data: BackendResponse = await response.json()
          if (data.success) {
            return data.data
          } else {
            return Promise.reject(data.message)
          }
        } else {
          const error = await response.json()
          return Promise.reject(error)
        }
      },
      onError: error => Promise.reject(error),
    },
  })
}

const searchInstance = createAlovaInstance('https://api.bilibili.com/x/web-interface/wbi/search/all/v2')

export {
  searchInstance,
}
