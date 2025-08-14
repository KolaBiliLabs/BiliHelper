import axios from 'axios'
import { useLoginModal } from '@/hooks/useLoginModal'
import { useUserStore } from '@/stores/userStore'
import { createElectronAdapter } from '@/utils/adapter'

const instance = axios.create({
  // @ts-ignore
  adapter: createElectronAdapter(),
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Referer': 'https://www.bilibili.com/',
  },
})

instance.interceptors.request.use(
  (config) => {
    const { currentUser } = useUserStore()
    const { openModal } = useLoginModal()

    if (currentUser.cookie) {
      config.headers.cookie = currentUser.cookie
    } else {
      window.$message.error('请先登录')
      openModal()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => {
    console.log('response response in request interceptors.response => ', response)
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  },
)

export {
  instance as request,
}
