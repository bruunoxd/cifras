import { useState, useEffect } from 'react'
import { isOfflineModeActive, songService } from '../store/supabase'
import './Favoritos.css'

export default function Favoritos() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOfflineModeActive) {
      // Simular favoritos offline
      setFavorites([])
    }
    setLoading(false)
  }, [])

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>❤️ Favoritos</h1>
        <p>Suas músicas preferidas</p>
      </div>

      {isOfflineModeActive && (
        <div className="offline-banner">
          <div className="offline-banner-content">
            <span className="offline-icon">🔌</span>
            <div>
              <strong>Modo Offline</strong>
              <p>Sistema de favoritos disponível apenas com Supabase configurado</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando favoritos...</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">❤️</div>
              <h3>Nenhum favorito ainda</h3>
              <p>
                {isOfflineModeActive 
                  ? 'Configure o Supabase para usar favoritos'
                  : 'Adicione músicas aos favoritos para vê-las aqui'
                }
              </p>
            </div>
          ) : (
            favorites.map((favorite) => (
              <div key={favorite.id} className="favorite-card">
                <div className="favorite-info">
                  <h3>{favorite.title}</h3>
                  <p>{favorite.artist}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
