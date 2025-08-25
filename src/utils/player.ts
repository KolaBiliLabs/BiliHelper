/* eslint-disable style/brace-style */
import { LIKE_STATUS_CHANGE, PLAY_MODE_CHANGE, PLAY_SONG_CHANGE, PLAY_STATUS_CHANGE } from '@constants/ipcChannels'
import { Howl, Howler } from 'howler'
import { cloneDeep } from 'lodash-es'
import { getVideoDetail } from '@/api/search'
import { usePlayStore } from '@/stores/playStore'
import { isElectron, isInList } from './helper'
import { calculateProgress } from './time'

export class Player {
  // 播放器
  private player: Howl
  // 定时器
  private playerInterval: ReturnType<typeof setInterval> | undefined

  constructor() {
    // 创建播放器实例
    this.player = new Howl({ src: [''], autoplay: false })
    // 初始化媒体会话
    this.initMediaSession()
  }

  /**
   * 获取播放歌曲信息
   * @returns 当前播放歌曲
   */
  private getPlaySongData(): ISong | null {
    const playStore = usePlayStore()
    // 播放列表
    const playlist = playStore.playQueue
    if (!playlist.length) {
      window.$message.error('播放列表为空')
      return null
    }
    return playlist[playStore.currentIndex]
  }

  /**
   * 初始化播放器
   * 核心外部调用
   * @param autoPlay 是否自动播放
   * @param seek 播放位置
   */
  async initPlayer(autoPlay: boolean = true, seek: number = 0) {
    const playStore = usePlayStore()

    try {
      // 获取播放数据
      const playSongData = this.getPlaySongData()
      if (!playSongData) {
        window.$message.error('当前歌曲不存在')
        return
      }
      // 更改状态
      playStore.loading = true
      // 在线歌曲
      if (playStore.playQueue.length) {
        const url = await this.getOnlineUrl(playSongData)
        // 正常播放地址
        if (url) {
          await this.createPlayer(url, autoPlay, seek)
        } else {
          if (playStore.playQueue.length === 1) {
            this.resetStatus()
            window.$message.warning('当前播放列表已无可播放歌曲，请更换')
          } else {
            window.$message.error('该歌曲无法播放，跳至下一首')
            this.nextOrPrev()
          }
        }
      }
    } catch (error) {
      console.error('❌ 初始化音乐播放器出错：', error)
      window.$message.error('播放器遇到错误，请尝试软件热重载')
      this.errorNext()
    }
  }

  /**
   * 获取在线播放地址
   * @param song 歌曲ID
   * @returns 播放地址
   */
  private async getOnlineUrl(song: ISong): Promise<string | null> {
    try {
      // [ ] 增加缓存： 将播放过的歌曲缓存到本地
      // 获取即将播放的歌曲
      const songDetail = await getVideoDetail(song.bvid)

      // 取第一个可用 url
      const url = songDetail.urls?.[0]
      if (!url) {
        console.error('未获取到音频播放地址')
        return null
      }
      return url
    } catch (error) {
      console.error('获取播放地址失败:', error)
      return null
    }
  }

  /**
   * 播放模式同步 ipc
   */
  playModeSyncIpc() {
    const playStore = usePlayStore()
    if (isElectron) {
      window.electron.ipcRenderer.send(PLAY_MODE_CHANGE, playStore.playSongMode)
    }
  }

  /**
   * 设置播放进度
   * @param time 播放进度
   */
  setSeek(time: number) {
    const playStore = usePlayStore()
    console.log(this.player, this.player.seek())
    this.player.seek(time)
    playStore.currentTime = time
  }

  /**
   * 获取播放进度
   * @returns 播放进度
   */
  getSeek(): number {
    return this.player.seek()
  }

  /**
   * 设置播放速率
   * @param rate 播放速率
   */
  setRate(rate: number) {
    const playStore = usePlayStore()
    this.player.rate(rate)
    playStore.playRate = rate
  }

  /**
   * 设置播放音量
   * @param actions 音量
   */
  setVolume(actions: number | 'up' | 'down' | WheelEvent) {
    const playStore = usePlayStore()
    const increment = 0.05
    // 直接设置
    if (typeof actions === 'number') {
      actions = Math.max(0, Math.min(actions, 1))
    }
    // 分类调节
    else if (actions === 'up' || actions === 'down') {
      playStore.playVolume = Math.max(
        0,
        Math.min(playStore.playVolume + (actions === 'up' ? increment : -increment), 1),
      )
    }
    // 鼠标滚轮
    else {
      const deltaY = actions.deltaY
      const volumeChange = deltaY > 0 ? -increment : increment
      playStore.playVolume = Math.max(0, Math.min(playStore.playVolume + volumeChange, 1))
    }
    // 调整音量
    this.player.volume(playStore.playVolume)
  }

  /**
   * 切换静音
   */
  toggleMute() {
    const playStore = usePlayStore()
    // 是否静音
    const isMuted = playStore.playVolume === 0
    // 恢复音量
    if (isMuted) {
      playStore.playVolume = playStore.playVolumeMute
    }
    // 保存当前音量并静音
    else {
      playStore.playVolumeMute = playStore.playVolume
      playStore.playVolume = 0
    }
    this.player.volume(playStore.playVolume)
  }

  /**
   * 处理播放状态
   */
  private handlePlayStatus() {
    const playStore = usePlayStore()
    // 清理定时器
    clearInterval(this.playerInterval)
    // 更新播放状态
    this.playerInterval = setInterval(() => {
      if (!this.player.playing()) {
        return
      }
      const currentTime = this.getSeek()
      const duration = this.player.duration()
      // 计算进度条距离
      const progress = calculateProgress(currentTime, duration)
      // 更新状态
      playStore.$patch({ currentTime, playDuration: duration, playProgress: progress })

      // todo 客户端事件
      // 每秒 4 次更新
    }, 250)
  }

  /**
   * 移除指定歌曲
   * @param index 歌曲索引
   */
  removeSongIndex(index: number) {
    const playStore = usePlayStore()

    // 若超出播放列表
    if (index >= playStore.playQueue.length)
      return
    // 仅剩一首
    if (playStore.playQueue.length === 1) {
      this.cleanPlayList()
      return
    }
    // 是否为当前播放歌曲
    const isCurrentPlay = playStore.currentIndex === index
    // 深拷贝，防止影响原数据
    const newPlaylist = cloneDeep(playStore.playQueue)
    // 若将移除最后一首
    if (index === playStore.playQueue.length - 1) {
      playStore.currentIndex = 0
    }
    // 若为当前播放之后
    else if (playStore.currentIndex > index) {
      playStore.currentIndex--
    }
    // 移除指定歌曲
    newPlaylist.splice(index, 1)
    playStore.playQueue = newPlaylist
    // 若为当前播放
    if (isCurrentPlay) {
      this.initPlayer(playStore.isPlaying)
    }
  }

  /**
   * 清空播放列表
   */
  async cleanPlayList() {
    const playStore = usePlayStore()

    // 停止播放
    Howler.unload()
    // 清空数据
    this.resetStatus()
    playStore.$patch({
      playQueue: [],
      currentIndex: -1,
      playVolume: 1,
      playRate: 1,
      playSongMode: 'repeat',
      playDuration: 0,
      playProgress: 0,
      currentTime: 0,
    })
    window.$message.success('已清空播放列表')
  }

  /**
   * 重置状态
   */
  resetStatus() {
    const playStore = usePlayStore()

    // 重置状态
    playStore.$patch({
      playDuration: 0,
      playProgress: 0,
      playVolume: 1,
      currentIndex: -1,
      playQueue: [],
      playSongMode: 'repeat',
      playRate: 1,
    })
  }

  /**
   * 播放
   */
  async play() {
    const playStore = usePlayStore()
    // 已在播放
    if (this.player.playing()) {
      playStore.isPlaying = true
      return
    }
    // 播放
    this.player.play()
    playStore.isPlaying = true
    // 淡入
    await new Promise<void>((resolve) => {
      this.player.once('play', () => {
        this.player.fade(0, playStore.playVolume, 0.5)
        resolve()
      })
    })
  }

  /**
   * 暂停
   * @param changeStatus 是否更改播放状态
   */
  async pause(changeStatus: boolean = true) {
    const playStore = usePlayStore()
    console.log('pause =>', this.player.state())

    // 播放器未加载完成
    if (this.player.state() !== 'loaded') {
      return
    }

    // 淡出
    await new Promise<void>((resolve) => {
      this.player.fade(playStore.playVolume, 0, 0.5)
      this.player.once('fade', () => {
        this.player.pause()
        if (changeStatus)
          playStore.isPlaying = false
        resolve()
      })
    })
  }

  /**
   * 播放或暂停
   */
  async playOrPause() {
    const playStore = usePlayStore()
    console.log('playOrPause =>', this, this.player, playStore.isPlaying)
    if (playStore.isPlaying) {
      await this.pause()
    } else {
      await this.play()
    }
  }

  /**
   * 切换播放索引
   * @param index 播放索引
   * @param play 是否立即播放
   */
  async togglePlayIndex(index: number, play: boolean = false) {
    const playStore = usePlayStore()
    // 若超出播放列表
    if (index >= playStore.playQueue.length) {
      return
    }
    // 相同
    if (!play && playStore.currentIndex === index) {
      this.play()
      return
    }
    // 更改状态
    playStore.currentIndex = index
    // 清理并播放
    this.resetStatus()
    await this.initPlayer()
  }

  /**
   * 更新播放列表
   * @param data 播放列表
   * @param song 当前播放歌曲
   * @param options 配置
   * @param options.play 是否直接播放
   * @param options.showTip 是否显示提示信息
   */
  async updatePlayList(
    data: ISong[],
    song?: ISong,
    options?: { play?: boolean, showTip?: boolean },
  ) {
    // 获取配置
    const { play, showTip } = options ?? { play: true, showTip: false }

    const playStore = usePlayStore()

    // 是否直接播放
    if (song && typeof song === 'object' && 'id' in song) {
      // 不在播放队列中则添加，在则不管
      if (data.findIndex(s => s.id === song.id) === -1) {
        const newList = cloneDeep(data)
        newList.push(song)
        playStore.setPlayQueue(cloneDeep(newList))
      }
      // 是否为当前播放歌曲
      if (playStore.currentSong && playStore.currentSong.id === song.id) {
        if (play) {
          await this.play()
        }
      } else {
        // 查找索引
        playStore.currentIndex = playStore.playQueue.findIndex(item => item.id === song.id)
        // 播放
        await this.pause(false)
        await this.initPlayer()
      }
    } else {
    // 更新播放队列
      playStore.setPlayQueue(cloneDeep(data))

      // 随机播放则取随机索引
      playStore.currentIndex = playStore.playSongMode === 'shuffle'
        ? Math.floor(Math.random() * data.length)
        // 其他模式则从头开始
        : 0
      await this.pause(false)
      await this.initPlayer()
    }

    if (showTip) {
      window.$message.success('已开始播放')
    }
  }

  /**
   * 创建播放器
   * @param src 播放地址
   * @param autoPlay 是否自动播放
   * @param seek 播放位置
   */
  private async createPlayer(src: string, autoPlay: boolean = true, seek: number = 0) {
    // 获取数据
    const playStore = usePlayStore()
    // 播放信息
    const { id: _id } = playStore.currentSong
    // 清理播放器
    Howler.unload()
    // 创建播放器
    this.player = new Howl({
      src,
      html5: true,
      autoplay: autoPlay,
      preload: 'metadata',
      pool: 1,
      volume: playStore.playVolume,
      rate: playStore.playRate,
    })
    // 播放器事件
    this.playerEvent({ seek })
    // 自动播放
    if (autoPlay)
      this.play()
    // 定时获取状态
    if (!this.playerInterval)
      this.handlePlayStatus()
    // 新增播放历史
    playStore.addToHistory(playStore.currentSong)
    // 更新 MediaSession
    this.updateMediaSession()
  }

  /**
   * 播放器事件
   */
  private playerEvent(
    options: {
      // 恢复进度
      seek?: number
    } = { seek: 0 },
  ) {
    // 获取数据
    const playStore = usePlayStore()
    // 获取配置
    const { seek } = options
    // 初次加载
    this.player.once('load', () => {
      // 恢复进度（ 需距离本曲结束大于 2 秒 ）
      if (seek && playStore.playDuration - playStore.currentTime > 2) {
        this.setSeek(seek)
      }
      // 更新状态
      playStore.loading = false
      // ipc
      if (isElectron) {
        window.electron.ipcRenderer.send(PLAY_SONG_CHANGE, playStore.currentSong)
        window.electron.ipcRenderer.send(LIKE_STATUS_CHANGE, isInList(playStore.liked, playStore.currentSong))
      }
    })
    // 播放
    this.player.on('play', () => {
      window.document.title = playStore.currentSong.custom?.name || playStore.currentSong.name || 'KolaHelper'
      // ipc
      if (isElectron) {
        window.electron.ipcRenderer.send(PLAY_STATUS_CHANGE, true)
        window.electron.ipcRenderer.send(PLAY_SONG_CHANGE, playStore.currentSong)
      }
      console.log('▶️ song play:', playStore.currentSong)
    })
    // 暂停
    this.player.on('pause', () => {
      window.document.title = playStore.currentSong.custom?.name || playStore.currentSong.name || 'KolaHelper'
      // ipc
      if (isElectron)
        window.electron.ipcRenderer.send(PLAY_STATUS_CHANGE, false)
      console.log('⏸️ song pause:', playStore.currentSong)
    })
    // 结束
    this.player.on('end', () => {
      // statusStore.playStatus = false;
      console.log('⏹️ song end:', playStore.currentSong)
      this.nextOrPrev('next')
    })
    // 错误
    this.player.on('loaderror', (sourceid, err: any) => {
      this.errorNext(err)
      console.error('❌ song error:', sourceid, playStore.currentSong, err)
    })
  }

  /**
   * 下一首或上一首
   * @param type 切换类别 next 下一首 prev 上一首
   * @param play 是否立即播放
   */
  async nextOrPrev(type: 'next' | 'prev' = 'next', play: boolean = true) {
    try {
      const playStore = usePlayStore()
      // 列表长度
      const playQueueLength = playStore.playQueue.length
      // 播放列表是否为空
      if (playQueueLength === 0) {
        throw new Error('列表为空')
      }
      // 只有一首歌的特殊处理
      if (playQueueLength === 1) {
        playStore.currentIndex = -1
        this.setSeek(0)
        await this.play()
      }

      // 根据播放模式切换歌曲
      switch (playStore.playSongMode) {
        // 列表循环
        case 'repeat':{
          playStore.currentIndex += type === 'next' ? 1 : -1
          break
        }
        // 随机播放
        case 'shuffle': {
          let newIndex: number
          // 确保不会随机到同一首
          do {
            newIndex = Math.floor(Math.random() * playQueueLength)
          } while (newIndex === playStore.currentIndex)
          playStore.currentIndex = newIndex
          break
        }
        // 单曲循环
        case 'repeat-once':{
          playStore.currentIndex = -1
          this.setSeek(0)
          await this.play()
          return
        }
        default:
          throw new Error('The play mode is not supported')
      }
      // 索引是否越界
      if (playStore.currentIndex < 0) {
        playStore.currentIndex = playQueueLength - 1
      } else if (playStore.currentIndex >= playQueueLength) {
        playStore.currentIndex = 0
      }
      // 暂停
      await this.pause(false)
      // 初始化播放器
      await this.initPlayer(play)
    } catch (error) {
      console.error('Error in nextOrPrev:', error)
      throw error
    }
  }

  /**
   * 错误处理 - 跳转到下一首
   * @param error 错误信息
   */
  private errorNext(error?: any) {
    console.error('播放错误，跳转下一首:', error)
    this.nextOrPrev('next')
  }

  /**
   * 初始化 MediaSession
   */
  private initMediaSession() {
    if (!('mediaSession' in navigator))
      return
    navigator.mediaSession.setActionHandler('play', () => this.play())
    navigator.mediaSession.setActionHandler('pause', () => this.pause())
    navigator.mediaSession.setActionHandler('previoustrack', () => this.nextOrPrev('prev'))
    navigator.mediaSession.setActionHandler('nexttrack', () => this.nextOrPrev('next'))
    // 跳转进度
    navigator.mediaSession.setActionHandler('seekto', (event) => {
      if (event.seekTime)
        this.setSeek(event.seekTime)
    })
  }

  /**
   * 更新 MediaSession
   */
  private updateMediaSession() {
    const playStore = usePlayStore()

    if ('mediaSession' in navigator) {
      const currentSong = playStore.currentSong
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.name || '未知歌曲',
        artist: currentSong.artist || '未知艺术家',
        album: currentSong.title || '未知专辑',
        artwork: currentSong.pic ? [{ src: currentSong.pic }] : [],
      })

      // 设置播放控制
      navigator.mediaSession.setActionHandler('play', () => this.play())
      navigator.mediaSession.setActionHandler('pause', () => this.pause())
      navigator.mediaSession.setActionHandler('previoustrack', () => this.nextOrPrev('prev'))
      navigator.mediaSession.setActionHandler('nexttrack', () => this.nextOrPrev('next'))
    }
  }
}

export default new Player()
