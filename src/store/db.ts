import Dexie, { Table } from 'dexie'

export type Song = {
  id?: number
  title: string
  artist: string
  content: string
}

export type Playlist = {
  id?: number
  name: string
  songIds: number[]
}

class CifrasDB extends Dexie {
  songs!: Table<Song, number>
  playlists!: Table<Playlist, number>

  constructor() {
    super('cifrasDB')
    this.version(1).stores({
      songs: '++id, title, artist',
      playlists: '++id, name',
    })
  }
}

export const db = new CifrasDB()
