import { useState, useEffect } from "react";
import { isOfflineModeActive } from "../store/supabase";
import "./Historico.css";

interface HistoryItem {
  id: number;
  song_title: string;
  artist: string;
  accessed_at: string;
  genre?: string;
  duration?: string;
  plays?: number;
}

export default function Historico() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("week");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      const mockHistory: HistoryItem[] = [
        {
          id: 1,
          song_title: "Imagine",
          artist: "John Lennon",
          accessed_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          genre: "Rock",
          duration: "3:07",
          plays: 15,
        },
        {
          id: 2,
          song_title: "Wonderwall",
          artist: "Oasis",
          accessed_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          genre: "Rock Alternativo",
          duration: "4:18",
          plays: 8,
        },
        {
          id: 3,
          song_title: "Tears in Heaven",
          artist: "Eric Clapton",
          accessed_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          genre: "Blues",
          duration: "4:32",
          plays: 12,
        },
        {
          id: 4,
          song_title: "Hotel California",
          artist: "Eagles",
          accessed_at: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 2
          ).toISOString(),
          genre: "Rock Clássico",
          duration: "6:30",
          plays: 22,
        },
        {
          id: 5,
          song_title: "Stairway to Heaven",
          artist: "Led Zeppelin",
          accessed_at: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 3
          ).toISOString(),
          genre: "Rock Clássico",
          duration: "8:02",
          plays: 18,
        },
        {
          id: 6,
          song_title: "Yesterday",
          artist: "The Beatles",
          accessed_at: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 5
          ).toISOString(),
          genre: "Pop Rock",
          duration: "2:05",
          plays: 9,
        },
      ];

      setHistory(mockHistory);
      setLoading(false);
    }, 800);
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${hours === 1 ? "hora" : "horas"} atrás`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} ${days === 1 ? "dia" : "dias"} atrás`;
    }
  };

  const clearHistory = () => {
    if (confirm("Deseja realmente limpar todo o histórico?")) {
      setHistory([]);
    }
  };

  const totalPlays = history.reduce((acc, item) => acc + (item.plays || 0), 0);
  const uniqueArtists = new Set(history.map((item) => item.artist)).size;
  const favoriteGenre = history.reduce((acc, item) => {
    const genre = item.genre || "Desconhecido";
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topGenre =
    Object.entries(favoriteGenre).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    "N/A";

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="icon">🕒</span>
            Histórico Musical
          </h1>
          <p className="page-subtitle">
            Suas músicas tocadas recentemente e estatísticas de reprodução
          </p>
        </div>
      </div>

      {isOfflineModeActive && (
        <div className="alert alert-warning offline-notice">
          <span className="alert-icon">🔌</span>
          <div className="alert-content">
            <strong>Modo Offline Ativo</strong>
            <p>Histórico limitado - apenas dados locais disponíveis</p>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="history-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎵</div>
            <div className="stat-info">
              <div className="stat-value">{history.length}</div>
              <div className="stat-label">Músicas no Histórico</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-info">
              <div className="stat-value">{totalPlays}</div>
              <div className="stat-label">Total de Reproduções</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-value">{uniqueArtists}</div>
              <div className="stat-label">Artistas Únicos</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎸</div>
            <div className="stat-info">
              <div className="stat-value">{topGenre}</div>
              <div className="stat-label">Gênero Favorito</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="history-filters">
        <div className="filter-group">
          <label>Período:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="filter-select"
          >
            <option value="today">Hoje</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="all">Todo Período</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="recent">Mais Recente</option>
            <option value="plays">Mais Tocadas</option>
            <option value="artist">Artista</option>
            <option value="title">Título</option>
          </select>
        </div>

        <button className="btn btn-secondary clear-btn" onClick={clearHistory}>
          <span className="btn-icon">🗑️</span>
          Limpar Histórico
        </button>
      </div>

      {/* Lista do Histórico */}
      <div className="history-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-icon">⏳</div>
            <p>Carregando histórico...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎵</div>
            <h3>Nenhum histórico encontrado</h3>
            <p>Comece tocando algumas músicas para ver seu histórico aqui!</p>
            <div className="empty-tips">
              <h4>Dicas:</h4>
              <ul>
                <li>📱 Toque músicas pelo app para aparecerem aqui</li>
                <li>🔍 Use a busca para encontrar novas cifras</li>
                <li>⭐ Salve suas favoritas nas listas</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <div className="item-info">
                  <div className="item-header">
                    <h3 className="song-title">{item.song_title}</h3>
                    <div className="item-meta">
                      <span className="time-ago">
                        {formatTime(item.accessed_at)}
                      </span>
                      {item.plays && (
                        <span className="play-count">
                          <span className="count-icon">🔄</span>
                          {item.plays}x
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="item-details">
                    <span className="artist">👤 {item.artist}</span>
                    {item.genre && (
                      <span className="genre">🎸 {item.genre}</span>
                    )}
                    {item.duration && (
                      <span className="duration">⏱️ {item.duration}</span>
                    )}
                  </div>
                </div>

                <div className="item-actions">
                  <button className="btn btn-primary play-btn">
                    <span className="btn-icon">▶️</span>
                    Tocar
                  </button>
                  <button className="btn btn-secondary remove-btn">
                    <span className="btn-icon">❌</span>
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      {history.length > 0 && (
        <div className="history-insights">
          <div className="section-header">
            <span className="section-icon">📊</span>
            <h2>Insights Musicais</h2>
          </div>

          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">🏆</div>
              <h4>Música Mais Tocada</h4>
              <p>
                <strong>
                  {
                    history.sort((a, b) => (b.plays || 0) - (a.plays || 0))[0]
                      ?.song_title
                  }
                </strong>
                <br />
                <small>
                  {
                    history.sort((a, b) => (b.plays || 0) - (a.plays || 0))[0]
                      ?.artist
                  }
                </small>
              </p>
            </div>

            <div className="insight-card">
              <div className="insight-icon">⭐</div>
              <h4>Artista Favorito</h4>
              <p>
                <strong>
                  {Object.entries(
                    history.reduce((acc, item) => {
                      acc[item.artist] = (acc[item.artist] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"}
                </strong>
              </p>
            </div>

            <div className="insight-card">
              <div className="insight-icon">📈</div>
              <h4>Atividade</h4>
              <p>
                <strong>
                  {
                    history.filter(
                      (item) =>
                        new Date(item.accessed_at) >
                        new Date(Date.now() - 24 * 60 * 60 * 1000)
                    ).length
                  }
                </strong>{" "}
                músicas nas últimas 24h
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
