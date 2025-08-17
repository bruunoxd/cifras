import { useState, useEffect } from 'react'
import { isOfflineModeActive } from '../store/supabase'
import './Historico.css'

export default function Historico() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOfflineModeActive) {
      // Simular dados de histórico offline
      setHistory([
        {
          id: 1,
          song_title: 'Imagine',
          artist: 'John Lennon',
          accessed_at: new Date().toISOString()
        }
      ])
    }
    setLoading(false)
  }, [])

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🕒 Histórico</h1>
        <p>Suas músicas tocadas recentemente</p>
      </div>

      {isOfflineModeActive && (
        <div className="offline-banner">
          <span className="offline-icon">🔌</span>
          <p>Histórico disponível apenas com Supabase configurado</p>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando histórico...</p>
        </div>
      ) : (
        <div className="history-list">
          {history.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🕒</div>
              <h3>Nenhum histórico encontrado</h3>
              <p>Toque algumas músicas para ver o histórico aqui</p>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="history-item">
                <div className="history-info">
                  <h3>{item.song_title}</h3>
                  <p>{item.artist}</p>
                  <span className="history-date">
                    {new Date(item.accessed_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
