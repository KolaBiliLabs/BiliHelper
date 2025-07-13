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
