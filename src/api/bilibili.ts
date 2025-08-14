import { BASE_URL_PREFIX, LOGIN_URL_PREFIX } from '@constants/urls'
import { useUserStore } from '@/stores/userStore'
import { request } from '@/utils/request'

/**
 * 获取登录url
 */
export function getLoginUrlApi() {
  return request({
    url: `${LOGIN_URL_PREFIX}/qrcode/generate`,
    method: 'GET',
  })
}

/**
 * 验证二维码是否被扫描
 * @param qrcode_key 收到的二维码key
 */
export function verifyQrCodeApi(qrcode_key: string) {
  return request({
    url: `${LOGIN_URL_PREFIX}/qrcode/poll`,
    method: 'GET',
    params: {
      qrcode_key,
    },
  })
}

/**
 * 获取用户信息
 */
export function getUserInfoApi(): PromiseData<IUser> {
  return request({
    url: `${BASE_URL_PREFIX}/x/web-interface/nav`,
  })
}

// 验证登录信息是否有效
export async function validateLoginInfoApi() {
  const { currentUser } = useUserStore()
  if (!currentUser?.cookie || !currentUser?.csrf)
    return

  return request.post('https://api.vc.bilibili.com/link_setting/v1/link_setting/get', {
    data: {
      msg_notify: '1',
      show_unfollowed_msg: '1',
      build: '0',
      mobi_app: 'web',
      csrf_token: currentUser.csrf,
      csrf: currentUser.csrf,
    },
  })
}
