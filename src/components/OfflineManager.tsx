import { useState, useEffect } from 'react'
import { Music } from '../store/types'
import './OfflineManager.css'

interface OfflineManagerProps {
  music: Music
  onToggle?: (isOffline: boolean) => void
  showLabel?: boolean
  size?: 'small' | 'medium' | 'large'
}

// Gerenciador de cache offline
class OfflineCache {
  private dbName = 'CifrasOfflineDB'
  private dbVersion = 1
  private storeName = 'musics'
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' })
          store.createIndex('title', 'title', { unique: false })
          store.createIndex('artist', 'artist', { unique: false })
        }
      }
    })
  }

  async addMusic(music: Music): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.put({
        ...music,
        downloadedAt: new Date().toISOString()
      })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async removeMusic(musicId: string): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(musicId)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async hasMusic(musicId: string): Promise<boolean> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.get(musicId)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(!!request.result)
    })
  }

  async getAllMusics(): Promise<Music[]> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async getStorageSize(): Promise<number> {
    try {
      const musics = await this.getAllMusics()
      return musics.reduce((total, music) => {
        return total + JSON.stringify(music).length
      }, 0)
    } catch {
      return 0
    }
  }
}

const offlineCache = new OfflineCache()

export default function OfflineManager({ 
  music, 
  onToggle, 
  showLabel = false, 
  size = 'medium' 
}: OfflineManagerProps) {
  const [isOffline, setIsOffline] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkOfflineStatus()
  }, [music.id])

  const checkOfflineStatus = async () => {
    try {
      const hasOffline = await offlineCache.hasMusic(music.id)
      setIsOffline(hasOffline)
    } catch (error) {
      console.error('Erro ao verificar status offline:', error)
    }
  }

  const toggleOffline = async () => {
    setIsLoading(true)

    try {
      if (isOffline) {
        await offlineCache.removeMusic(music.id)
        setIsOffline(false)
        onToggle?.(false)
      } else {
        await offlineCache.addMusic(music)
        setIsOffline(true)
        onToggle?.(true)
      }
    } catch (error) {
      console.error('Erro ao alterar status offline:', error)
      alert('Erro ao alterar status offline. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const iconSize = {
    small: '16',
    medium: '20', 
    large: '24'
  }[size]

  const buttonClass = `offline-button ${size} ${isOffline ? 'offline' : ''} ${isLoading ? 'loading' : ''}`

  return (
    <button
      className={buttonClass}
      onClick={toggleOffline}
      disabled={isLoading}
      title={isOffline ? 'Remover do offline' : 'Baixar para offline'}
      aria-label={isOffline ? 'Remover do offline' : 'Baixar para offline'}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={isOffline ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        {isOffline ? (
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3"/>
        ) : (
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m11-9-5 5-5-5m5-5v12"/>
        )}
      </svg>
      {showLabel && (
        <span className="offline-label">
          {isOffline ? 'Disponível offline' : 'Baixar offline'}
        </span>
      )}
    </button>
  )
}

// Hook para gerenciar músicas offline
export function useOfflineMusics() {
  const [offlineMusics, setOfflineMusics] = useState<Music[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [storageSize, setStorageSize] = useState(0)

  const loadOfflineMusics = async () => {
    setIsLoading(true)
    
    try {
      const musics = await offlineCache.getAllMusics()
      const size = await offlineCache.getStorageSize()
      
      setOfflineMusics(musics)
      setStorageSize(size)
    } catch (error) {
      console.error('Erro ao carregar músicas offline:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeOfflineMusic = async (musicId: string) => {
    try {
      await offlineCache.removeMusic(musicId)
      setOfflineMusics(prev => prev.filter(music => music.id !== musicId))
      
      // Recalcular tamanho
      const size = await offlineCache.getStorageSize()
      setStorageSize(size)
    } catch (error) {
      console.error('Erro ao remover música offline:', error)
      throw error
    }
  }

  const clearAllOffline = async () => {
    try {
      const musics = await offlineCache.getAllMusics()
      
      for (const music of musics) {
        await offlineCache.removeMusic(music.id)
      }
      
      setOfflineMusics([])
      setStorageSize(0)
    } catch (error) {
      console.error('Erro ao limpar cache offline:', error)
      throw error
    }
  }

  const formatStorageSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  useEffect(() => {
    loadOfflineMusics()
  }, [])

  return {
    offlineMusics,
    isLoading,
    storageSize: formatStorageSize(storageSize),
    loadOfflineMusics,
    removeOfflineMusic,
    clearAllOffline
  }
}
