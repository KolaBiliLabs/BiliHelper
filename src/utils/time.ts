import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/zh-cn'

dayjs.extend(duration)
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

// 秒转为时间
export function secondsToTime(seconds: number) {
  if (seconds < 3600) {
    return dayjs.duration(seconds, 'seconds').format('m:ss')
  } else {
    return dayjs.duration(seconds, 'seconds').format('H:mm:ss')
  }
}

// 毫秒转为时间
export function msToTime(milliseconds: number) {
  const dur = dayjs.duration(milliseconds, 'milliseconds')
  return milliseconds < 3600000 ? dur.format('mm:ss') : dur.format('H:mm:ss')
}

// 毫秒转为秒
export function msToS(milliseconds: number, decimalPlaces: number = 2): number {
  return Number((milliseconds / 1000).toFixed(decimalPlaces))
}

/**
 * 格式化时间戳
 * @param {number|undefined} timestamp - 要格式化的时间戳（以毫秒为单位）。如果为 `null` 或 `0`，则返回空字符串。
 * @param {string} [format] - 可选的时间格式，默认格式为 "YYYY-MM-DD"。可传入任意 dayjs 支持的格式。
 * @returns {string} - 根据指定格式返回的日期字符串
 */
export function formatTimestamp(timestamp: number | undefined, format: string = 'YYYY-MM-DD'): string {
  if (!timestamp)
    return ''
  const date = dayjs(timestamp)
  const currentYear = dayjs().year()
  const year = date.year()
  // 如果年份相同
  if (year === currentYear) {
    return date.format(format.replace('YYYY-', ''))
  }
  return date.format(format)
}

/**
 * 根据进度和总时长反推当前时间
 * @param {number} progress 进度百分比，范围通常是0到100
 * @param {number} duration 总时长，单位为秒
 * @returns {number} 当前时间，单位为秒，精确到0.01秒
 */
export function calculateCurrentTime(progress: number, duration: number): number {
  // 确保在有效范围内
  progress = Math.min(Math.max(progress, 0), 100)

  const currentTime = (progress / 100) * duration
  return Math.round(currentTime * 100) / 100
}
