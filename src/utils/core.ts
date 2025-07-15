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
