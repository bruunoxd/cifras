export interface Music {
  id: string
  title: string
  artist: string
  content: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface MusicList {
  id: string
  name: string
  description?: string
  user_id: string
  musics: string[] // Array de IDs das músicas
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name?: string
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  music_id: string
  music_title: string
  created_at: string
}

export interface HistoryEntry {
  id: string
  user_id: string
  music_id: string
  music_title: string
  accessed_at: string
  duration_seconds?: number
}

export interface ChordPosition {
  chord: string
  position: number
  line: number
}

export interface CifraSettings {
  fontSize: number
  autoScroll: boolean
  scrollSpeed: number
  showChords: boolean
  darkMode: boolean
  transpose: number
  instrument: 'guitar' | 'ukulele' | 'piano'
}
