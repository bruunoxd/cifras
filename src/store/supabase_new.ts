import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase - substitua pelos seus valores reais
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Detectar se está no modo desenvolvimento (sem configuração do Supabase)
const isOfflineMode = supabaseUrl === 'https://your-project.supabase.co' || supabaseKey === 'your-anon-key'

export const supabase = isOfflineMode ? null : createClient(supabaseUrl, supabaseKey)

// Tipos TypeScript para o banco de dados
export interface Song {
  id?: number
  title: string
  artist: string
  key?: string // Tom da música (C, D, E, etc.)
  capo?: number // Casa do capo
  lyrics: string // Letra da música
  chords: string // Acordes/cifra
  content: string // Conteúdo completo formatado
  genre?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  created_at?: string
  updated_at?: string
  user_id?: string
}

export interface Playlist {
  id?: number
  name: string
  description?: string
  song_ids: number[]
  created_at?: string
  updated_at?: string
  user_id?: string
}

// Dados mock para modo offline
const mockSongs: Song[] = [
  {
    id: 1,
    title: "Imagine",
    artist: "John Lennon",
    key: "C",
    capo: 0,
    lyrics: "Imagine there's no heaven\nIt's easy if you try\nNo hell below us\nAbove us only sky",
    chords: "C Cmaj7 F C Cmaj7 F",
    content: "[C]Imagine there's no [Cmaj7]heaven\n[F]It's easy if you [C]try\n[Cmaj7]No hell be[F]low us\n[C]Above us only [Cmaj7]sky[F]",
    genre: "Rock",
    difficulty: "beginner",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Wonderwall",
    artist: "Oasis",
    key: "Em",
    capo: 2,
    lyrics: "Today is gonna be the day\nThat they're gonna throw it back to you",
    chords: "Em7 G D C Em7 G D C",
    content: "[Em7]Today is gonna be the [G]day\n[D]That they're gonna throw it [C]back to you",
    genre: "Rock",
    difficulty: "intermediate",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Let It Be",
    artist: "The Beatles",
    key: "C",
    capo: 0,
    lyrics: "When I find myself in times of trouble\nMother Mary comes to me",
    chords: "C G Am F C G F C",
    content: "[C]When I find myself in [G]times of trouble\n[Am]Mother Mary [F]comes to me\n[C]Speaking words of [G]wisdom\n[F]Let it [C]be",
    genre: "Rock",
    difficulty: "beginner",
    created_at: new Date().toISOString()
  }
]

const mockPlaylists: Playlist[] = [
  {
    id: 1,
    name: "Favoritas",
    description: "Minhas músicas favoritas",
    song_ids: [1, 3],
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Rock Clássico",
    description: "Os melhores do rock",
    song_ids: [2, 3],
    created_at: new Date().toISOString()
  }
]

// Storage local para modo offline
const getLocalStorage = (key: string, defaultValue: any) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

const setLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('Erro ao salvar no localStorage:', error)
  }
}

// Funções para gerenciar músicas
export const songService = {
  // Listar todas as músicas
  async getAll(): Promise<Song[]> {
    if (isOfflineMode) {
      const songs = getLocalStorage('cifras_songs', mockSongs)
      return songs.sort((a: Song, b: Song) => 
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      )
    }

    const { data, error } = await supabase!
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Buscar músicas
  async search(query: string): Promise<Song[]> {
    if (isOfflineMode) {
      const songs = getLocalStorage('cifras_songs', mockSongs)
      const searchTerm = query.toLowerCase()
      return songs.filter((song: Song) =>
        song.title.toLowerCase().includes(searchTerm) ||
        song.artist.toLowerCase().includes(searchTerm) ||
        song.lyrics.toLowerCase().includes(searchTerm) ||
        song.chords.toLowerCase().includes(searchTerm)
      )
    }

    const { data, error } = await supabase!
      .from('songs')
      .select('*')
      .or(`title.ilike.%${query}%,artist.ilike.%${query}%,lyrics.ilike.%${query}%,chords.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Criar música
  async create(song: Omit<Song, 'id' | 'created_at' | 'updated_at'>): Promise<Song> {
    if (isOfflineMode) {
      const songs = getLocalStorage('cifras_songs', mockSongs)
      const newSong = {
        ...song,
        id: Math.max(...songs.map((s: Song) => s.id || 0)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      songs.unshift(newSong)
      setLocalStorage('cifras_songs', songs)
      return newSong
    }

    const { data, error } = await supabase!
      .from('songs')
      .insert([song])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar música
  async update(id: number, updates: Partial<Song>): Promise<Song> {
    if (isOfflineMode) {
      const songs = getLocalStorage('cifras_songs', mockSongs)
      const index = songs.findIndex((s: Song) => s.id === id)
      if (index === -1) throw new Error('Música não encontrada')
      
      songs[index] = { ...songs[index], ...updates, updated_at: new Date().toISOString() }
      setLocalStorage('cifras_songs', songs)
      return songs[index]
    }

    const { data, error } = await supabase!
      .from('songs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar música
  async delete(id: number): Promise<void> {
    if (isOfflineMode) {
      const songs = getLocalStorage('cifras_songs', mockSongs)
      const filteredSongs = songs.filter((s: Song) => s.id !== id)
      setLocalStorage('cifras_songs', filteredSongs)
      return
    }

    const { error } = await supabase!
      .from('songs')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Transpor acordes
  transposeChords(chords: string, steps: number): string {
    const chordMap: { [key: string]: string[] } = {
      'C': ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
      'D': ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#'],
      'E': ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
      'F': ['F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'],
      'G': ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#'],
      'A': ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
      'B': ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#']
    }
    
    // Implementação básica de transposição
    return chords.replace(/[CDEFGAB]#?/g, (chord) => {
      const baseChords = chordMap['C']
      const currentIndex = baseChords.indexOf(chord)
      if (currentIndex === -1) return chord
      
      const newIndex = (currentIndex + steps + 12) % 12
      return baseChords[newIndex]
    })
  }
}

// Funções para gerenciar playlists
export const playlistService = {
  async getAll(): Promise<Playlist[]> {
    if (isOfflineMode) {
      return getLocalStorage('cifras_playlists', mockPlaylists)
    }

    const { data, error } = await supabase!
      .from('playlists')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(playlist: Omit<Playlist, 'id' | 'created_at' | 'updated_at'>): Promise<Playlist> {
    if (isOfflineMode) {
      const playlists = getLocalStorage('cifras_playlists', mockPlaylists)
      const newPlaylist = {
        ...playlist,
        id: Math.max(...playlists.map((p: Playlist) => p.id || 0)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      playlists.unshift(newPlaylist)
      setLocalStorage('cifras_playlists', playlists)
      return newPlaylist
    }

    const { data, error } = await supabase!
      .from('playlists')
      .insert([playlist])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: number, updates: Partial<Playlist>): Promise<Playlist> {
    if (isOfflineMode) {
      const playlists = getLocalStorage('cifras_playlists', mockPlaylists)
      const index = playlists.findIndex((p: Playlist) => p.id === id)
      if (index === -1) throw new Error('Playlist não encontrada')
      
      playlists[index] = { ...playlists[index], ...updates, updated_at: new Date().toISOString() }
      setLocalStorage('cifras_playlists', playlists)
      return playlists[index]
    }

    const { data, error } = await supabase!
      .from('playlists')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: number): Promise<void> {
    if (isOfflineMode) {
      const playlists = getLocalStorage('cifras_playlists', mockPlaylists)
      const filteredPlaylists = playlists.filter((p: Playlist) => p.id !== id)
      setLocalStorage('cifras_playlists', filteredPlaylists)
      return
    }

    const { error } = await supabase!
      .from('playlists')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Verificar se está em modo offline para mostrar aviso
export const isOfflineModeActive = isOfflineMode

console.log(isOfflineMode ? '🔌 Modo Offline Ativo - usando dados locais' : '☁️ Conectado ao Supabase')
