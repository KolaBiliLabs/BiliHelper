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
