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

export { dayjs }
