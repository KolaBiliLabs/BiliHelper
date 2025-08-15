/* eslint-disable node/prefer-global/process */
import type { IMusicInfo } from './musicDownloader'
import path from 'node:path'
import Database from 'better-sqlite3'
import fs from 'fs-extra'

export interface IPlaylist {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  musicCount: number
}

export interface IPlaylistMusic {
  playlistId: string
  musicId: string
  order: number
  addedAt: string
}

export class DatabaseManager {
  private db: Database.Database
  private dbPath: string

  constructor() {
    const dataDir = path.join(process.env.APPDATA || process.env.HOME || '', '.kolaBiliHelper', 'music')
    this.dbPath = path.join(dataDir, 'music.db')
    fs.ensureDirSync(dataDir)

    this.db = new Database(this.dbPath)
    this.initDatabase()
  }

  /**
   * 初始化数据库表
   */
  private initDatabase() {
    // 音乐表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS music (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        album TEXT,
        duration REAL DEFAULT 0,
        filePath TEXT NOT NULL,
        fileSize INTEGER DEFAULT 0,
        downloadTime TEXT NOT NULL,
        tags TEXT,
        playCount INTEGER DEFAULT 0,
        lastPlayed TEXT,
        favorite INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      )
    `)

    // 播放列表表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS playlists (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        musicCount INTEGER DEFAULT 0
      )
    `)

    // 播放列表音乐关联表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS playlist_music (
        playlistId TEXT NOT NULL,
        musicId TEXT NOT NULL,
        order_num INTEGER NOT NULL,
        addedAt TEXT NOT NULL,
        PRIMARY KEY (playlistId, musicId),
        FOREIGN KEY (playlistId) REFERENCES playlists (id) ON DELETE CASCADE,
        FOREIGN KEY (musicId) REFERENCES music (id) ON DELETE CASCADE
      )
    `)

    // 创建索引
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_music_artist ON music (artist);
      CREATE INDEX IF NOT EXISTS idx_music_album ON music (album);
      CREATE INDEX IF NOT EXISTS idx_music_favorite ON music (favorite);
      CREATE INDEX IF NOT EXISTS idx_playlist_music_order ON playlist_music (playlistId, order_num);
    `)
  }

  /**
   * 保存音乐信息
   */
  saveMusic(musicInfo: IMusicInfo): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO music 
      (id, title, artist, album, duration, filePath, fileSize, downloadTime, tags, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      musicInfo.id,
      musicInfo.title,
      musicInfo.artist,
      musicInfo.album || null,
      musicInfo.duration,
      musicInfo.filePath,
      musicInfo.fileSize,
      musicInfo.downloadTime,
      JSON.stringify(musicInfo.tags || {}),
      new Date().toISOString(),
    )
  }

  /**
   * 获取所有音乐
   */
  getAllMusic(): IMusicInfo[] {
    const stmt = this.db.prepare(`
      SELECT * FROM music ORDER BY createdAt DESC
    `)

    const rows = stmt.all() as any[]
    return rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : {},
    }))
  }

  /**
   * 根据ID获取音乐
   */
  getMusicById(id: string): IMusicInfo | null {
    const stmt = this.db.prepare(`
      SELECT * FROM music WHERE id = ?
    `)

    const row = stmt.get(id) as any
    if (!row)
      return null

    return {
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : {},
    }
  }

  /**
   * 搜索音乐
   */
  searchMusic(query: string): IMusicInfo[] {
    const stmt = this.db.prepare(`
      SELECT * FROM music 
      WHERE title LIKE ? OR artist LIKE ? OR album LIKE ?
      ORDER BY createdAt DESC
    `)

    const searchTerm = `%${query}%`
    const rows = stmt.all(searchTerm, searchTerm, searchTerm) as any[]

    return rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : {},
    }))
  }

  /**
   * 删除音乐
   */
  deleteMusic(id: string): boolean {
    const music = this.getMusicById(id)
    if (!music)
      return false

    // 删除文件
    try {
      fs.removeSync(music.filePath)
    } catch (error) {
      console.warn('删除文件失败:', error)
    }

    // 删除数据库记录
    const stmt = this.db.prepare(`
      DELETE FROM music WHERE id = ?
    `)

    const result = stmt.run(id)
    return result.changes > 0
  }

  /**
   * 更新播放次数
   */
  updatePlayCount(id: string): void {
    const stmt = this.db.prepare(`
      UPDATE music 
      SET playCount = playCount + 1, lastPlayed = ?
      WHERE id = ?
    `)

    stmt.run(new Date().toISOString(), id)
  }

  /**
   * 切换收藏状态
   */
  toggleFavorite(id: string): boolean {
    const stmt = this.db.prepare(`
      UPDATE music 
      SET favorite = CASE WHEN favorite = 1 THEN 0 ELSE 1 END
      WHERE id = ?
    `)

    const result = stmt.run(id)
    return result.changes > 0
  }

  /**
   * 获取收藏的音乐
   */
  getFavoriteMusic(): IMusicInfo[] {
    const stmt = this.db.prepare(`
      SELECT * FROM music WHERE favorite = 1 ORDER BY lastPlayed DESC
    `)

    const rows = stmt.all() as any[]
    return rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : {},
    }))
  }

  /**
   * 创建播放列表
   */
  createPlaylist(name: string, description?: string): string {
    const id = `playlist_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const now = new Date().toISOString()

    const stmt = this.db.prepare(`
      INSERT INTO playlists (id, name, description, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?)
    `)

    stmt.run(id, name, description || null, now, now)
    return id
  }

  /**
   * 获取所有播放列表
   */
  getAllPlaylists(): IPlaylist[] {
    const stmt = this.db.prepare(`
      SELECT * FROM playlists ORDER BY updatedAt DESC
    `)

    return stmt.all() as IPlaylist[]
  }

  /**
   * 添加音乐到播放列表
   */
  addMusicToPlaylist(playlistId: string, musicId: string): boolean {
    // 检查播放列表和音乐是否存在
    const playlist = this.db.prepare('SELECT id FROM playlists WHERE id = ?').get(playlistId)
    const music = this.db.prepare('SELECT id FROM music WHERE id = ?').get(musicId)

    if (!playlist || !music)
      return false

    // 获取当前播放列表中的音乐数量
    const countStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM playlist_music WHERE playlistId = ?
    `)
    const { count } = countStmt.get(playlistId) as { count: number }

    // 添加音乐到播放列表
    const stmt = this.db.prepare(`
      INSERT INTO playlist_music (playlistId, musicId, order_num, addedAt)
      VALUES (?, ?, ?, ?)
    `)

    stmt.run(playlistId, musicId, count + 1, new Date().toISOString())

    // 更新播放列表的音乐数量
    const updateStmt = this.db.prepare(`
      UPDATE playlists 
      SET musicCount = musicCount + 1, updatedAt = ?
      WHERE id = ?
    `)

    updateStmt.run(new Date().toISOString(), playlistId)
    return true
  }

  /**
   * 获取播放列表中的音乐
   */
  getPlaylistMusic(playlistId: string): IMusicInfo[] {
    const stmt = this.db.prepare(`
      SELECT m.* FROM music m
      JOIN playlist_music pm ON m.id = pm.musicId
      WHERE pm.playlistId = ?
      ORDER BY pm.order_num
    `)

    const rows = stmt.all(playlistId) as any[]
    return rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : {},
    }))
  }

  /**
   * 删除播放列表
   */
  deletePlaylist(playlistId: string): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM playlists WHERE id = ?
    `)

    const result = stmt.run(playlistId)
    return result.changes > 0
  }

  /**
   * 获取数据库统计信息
   */
  getStats() {
    const musicCount = this.db.prepare('SELECT COUNT(*) as count FROM music').get() as { count: number }
    const playlistCount = this.db.prepare('SELECT COUNT(*) as count FROM playlists').get() as { count: number }
    const favoriteCount = this.db.prepare('SELECT COUNT(*) as count FROM music WHERE favorite = 1').get() as { count: number }
    const totalSize = this.db.prepare('SELECT SUM(fileSize) as size FROM music').get() as { size: number }

    return {
      musicCount: musicCount.count,
      playlistCount: playlistCount.count,
      favoriteCount: favoriteCount.count,
      totalSize: totalSize.size || 0,
    }
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    this.db.close()
  }
}
