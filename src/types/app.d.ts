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
  mid: number
  typeid: string
  typename: string
  arcurl: string
  aid: number
  bvid: string
  title: string
  description: string
  arcrank: string
  pic: string
  play: number
  video_review: number
  favorites: number
  tag: string
  review: number
  pubdate: number
  senddate: number
  duration: string
  badgepay: boolean
  hit_columns: string[]
  view_type: string
  is_pay: number
  is_union_video: number
  rec_tags: any // 可能为 null 或其他类型
  new_rec_tags: any[]
  rank_score: number
  like: number
  upic: string
  corner: string
  cover: string
  desc: string
  url: string
  rec_reason: string
  danmaku: number
  biz_data: any // 可能为 null 或其他类型
  is_charge_video: number
  vt: number
  enable_vt: number
  vt_display: string
  subtitle: string
  episode_count_text: string
  release_status: number
  is_intervene: number
  area: number
  style: number
  cate_name: string
  is_live_room_inline: number
  live_status: number
  live_time: string
  online: number
  rank_index: number
  rank_offset: number
  roomid: number
  short_id: number
  spread_id: number
  tags: string
  uface: string
  uid: number
  uname: string
  user_cover: string
  parent_area_id: number
  parent_area_name: string
  watched_show: any // 可能为 null 或其他类型
}
