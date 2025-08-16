import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
dayjs.extend(timezone)
dayjs.extend(utc)

export function formatTime(time: string | number, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(time).format(format)
}

/**
 * 计算进度条移动的距离
 * @param {number} currentTime
 * @param {number} duration
 * @returns {number} 进度条移动的距离，精确到 0.01，最大为 100
 */
export function calculateProgress(currentTime: number, duration: number): number {
  if (duration === 0)
    return 0

  const progress = (currentTime / duration) * 100
  return Math.min(Math.round(progress * 100) / 100, 100)
}

export { dayjs }
