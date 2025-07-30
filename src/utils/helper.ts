// 系统判断
const userAgent = window.navigator.userAgent
export const isWin = userAgent.includes('Windows')
export const isMac = userAgent.includes('Macintosh')
export const isLinux = userAgent.includes('Linux')
export const isElectron = userAgent.includes('Electron')

/**
 * 用于为封面 url 添加协议 https
 * @param thumb origin url
 * @returns thumb
 */
export function handleThumb(thumb: string) {
  if (thumb.startsWith('http') || thumb.startsWith('https')) {
    return thumb
  }
  return `https:${thumb}`
}

/**
 * 用于延迟 timer s 执行
 */
export function delay(timer: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, timer)
  })
}
