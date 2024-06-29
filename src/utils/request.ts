import axios from 'axios'

const instance = axios.create({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Referer': 'https://www.bilibili.com/',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 统一处理返回数据
    if (response.data && response.data.success === false) {
      // 这里可以自定义错误处理
      return Promise.reject(response.data.message || '请求失败')
    }
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  },
)

export {
  instance as request,
}
