interface IUser {
  mid: number
  uname: string
  face: string
  cookie?: string
  csrf?: string
  medals: IUserMedal[]
  medalCount: number
  wbi_img: {
    img_url: string
    sub_url: string
  }
}

interface IAccess {
  uid: number
  cookie?: string
  csrf?: string
}

interface ISuggestion {
  term: string
  type: string
  value: string
}

interface IBilibiliVideoData {
  type: 'video'
  id: number
  author: string
  aid: number
  bvid: string
  title: string
  description: string
  pic: string
  danmaku: number
  tags: string
  uface: string
  uid: number
  uname: string
  user_cover: string
  duration: string
  typename: string
}

interface ISong {
  urls: string[]
  name: string
  title: string
  author: string
  pic: string
  artist: string
  bvid: string
  duration: number
}

interface ICollection {
  songs: ISong[]
  name: string
  id: string
}

interface IDemandMusic {
  demand: string
  uname: string
  uid: number
  isFree: boolean
}

interface IUnifiedData {
  // 基础信息
  timestamp: number
  source: 'browser-extension'
  version: string

  // URL 参数信息
  params: {
    bvId?: string
    [key: string]: any
  }

  // 视频信息
  video: {
    title: string
    url: string
    currentTime: number
    duration: number
    paused: boolean
    src: string
    videoWidth: number
    videoHeight: number
    readyState: number
  }

  // 自定义歌曲信息
  song: {
    name: string
    startTime: number
    endTime: number
  }

  // 扩展信息
  metadata?: {
    [key: string]: any
  }
}
