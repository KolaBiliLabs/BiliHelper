import axios from 'axios'

const baseUrl = '/api/'

const instance = axios.create({
  baseURL: baseUrl, // 替换为你的后端地址
  timeout: 15000,
  withCredentials: true,
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 这里可以自动携带 token
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
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
    // 统一处理错误
    // 可以根据 error.response.status 做不同处理
    return Promise.reject(error)
  },
)

export {
  instance as request,
}
