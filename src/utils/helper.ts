// 系统判断
const userAgent = window.navigator.userAgent
export const isWin = userAgent.includes('Windows')
export const isMac = userAgent.includes('Macintosh')
export const isLinux = userAgent.includes('Linux')
export const isElectron = userAgent.includes('Electron')
