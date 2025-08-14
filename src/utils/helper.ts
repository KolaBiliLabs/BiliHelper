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

/**
 * @description 用于判断指定歌曲是否存在于指定歌单中
 * 判断依据
 * 1. id 相同
 * 2. 自定义歌曲信息相同 (customName, startTime, endTime)
 * @returns {number} index
 */
export function isInList(list: ISong[], song: ISong) {
  const idx = list.findIndex((s) => {
    if (s.id !== song.id) {
      return false
    }
    if (s.bvid !== song.bvid) {
      return false
    }
    if (s.custom?.name !== song.custom?.name) {
      return false
    }
    if (s.custom?.startTime !== song.custom?.startTime) {
      return false
    }
    if (s.custom?.endTime !== song.custom?.endTime) {
      return false
    }
    return true
  })
  return idx
}

/**
 * @description 用于判断两个歌曲是否相同
 * 判断依据
 * 1. id 相同
 * 2. bvid 相同
 * 3. 自定义歌曲信息相同 (customName, startTime, endTime)
 * @param song1
 * @param song2
 * @returns {boolean} 是否相同
 */
export function isSameSong(song1: ISong, song2: ISong): boolean {
  if (song1.id !== song2.id) {
    return false
  }
  if (song1.bvid !== song2.bvid) {
    return false
  }
  if (song1.custom?.name !== song2.custom?.name) {
    return false
  }
  if (song1.custom?.startTime !== song2.custom?.startTime) {
    return false
  }
  if (song1.custom?.endTime !== song2.custom?.endTime) {
    return false
  }
  return true
}

/**
 * @description 用于将指定歌曲添加到指定数组中，并保持数组长度不超过指定长度
 * @param arr 数组
 * @param item 歌曲
 * @param max 最大长度
 */
export function lruInsert<T extends ISong>(arr: T[], item: T, max: number) {
  const idx = isInList(arr, item)
  if (idx !== -1) {
    arr.splice(idx, 1)
  }
  arr.unshift(item)
  if (arr.length > max) {
    arr.pop()
  }
}

/**
 * @description 组装 SongInfo
 */
export async function assembleSongInfo(songDetail: ISong, unifiedData: IUnifiedData) {
  const id = await generateCustomSongId(songDetail.bvid, unifiedData.video.title, unifiedData.video.currentTime, unifiedData.video.duration)

  return {
    urls: songDetail.urls,
    name: songDetail.name,
    title: songDetail.title,
    author: songDetail.author,
    pic: songDetail.pic,
    artist: songDetail.artist,
    bvid: songDetail.bvid,
    duration: songDetail.duration,

    id,

    custom: {
      name: unifiedData.song.name,
      startTime: unifiedData.song.startTime,
      endTime: unifiedData.song.endTime,
      source: 'browser-extension',
    },
  }
}

/**
 * @description 生成自定义歌曲 ID
 * @param bvid 视频 BV 号
 * @param customName 自定义名称
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns 自定义歌曲 ID
 */
export async function generateCustomSongId(bvid: string, customName: string, startTime: number, endTime: number) {
  const content = `${bvid}_${customName}_${startTime}_${endTime}`
  return `custom_${content}`
}
