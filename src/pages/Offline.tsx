import { useOfflineMusics } from "../components/OfflineManager";
import OfflineManager from "../components/OfflineManager";
import CifraViewer from "../components/CifraViewer";
import { Music } from "../store/types";
import { useState } from "react";
import "./Offline.css";

export default function Offline() {
  const {
    offlineMusics,
    isLoading,
    storageSize,
    clearAllOffline,
    removeOfflineMusic,
  } = useOfflineMusics();
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<"recent" | "title" | "artist" | "size">(
    "recent"
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleClearAll = async () => {
    if (
      window.confirm("Tem certeza que deseja remover todas as músicas offline?")
    ) {
      try {
        await clearAllOffline();
      } catch (error) {
        alert("Erro ao limpar músicas offline. Tente novamente.");
      }
    }
  };

  const handleRemoveMusic = async (musicId: string) => {
    if (
      window.confirm("Tem certeza que deseja remover esta música do offline?")
    ) {
      try {
        await removeOfflineMusic(musicId);
      } catch (error) {
        alert("Erro ao remover música. Tente novamente.");
      }
    }
  };

  const selectMusic = (music: Music) => {
    setSelectedMusic(music);
  };

  // Filtrar e ordenar músicas
  const filteredAndSortedMusics = offlineMusics
    .filter(
      (music) =>
        music.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (music.artist &&
          music.artist.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "artist":
          return (a.artist || "").localeCompare(b.artist || "");
        case "size":
          return (b.content?.length || 0) - (a.content?.length || 0);
        case "recent":
        default:
          return (
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
          );
      }
    });

  // Calcular estatísticas
  const totalSize = offlineMusics.reduce(
    (acc, music) => acc + (music.content?.length || 0),
    0
  );
  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${kb.toFixed(1)} KB`;
  };

  const averageSize = totalSize / (offlineMusics.length || 1);
  const uniqueArtists = new Set(
    offlineMusics.map((m) => m.artist).filter(Boolean)
  ).size;

  if (selectedMusic) {
    return (
      <div className="page-container">
        <div className="offline-viewer-header">
          <button
            onClick={() => setSelectedMusic(null)}
            className="btn btn-secondary back-btn"
          >
            <span className="btn-icon">←</span>
            Voltar para Offline
          </button>
          <div className="offline-badge">
            <span className="badge-icon">📱</span>
            Disponível offline
          </div>
        </div>

        <CifraViewer
          title={selectedMusic.title}
          artist={selectedMusic.artist}
          lyrics={selectedMusic.content}
          chords=""
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="icon">📱</span>
            Músicas Offline
          </h1>
          <p className="page-subtitle">
            Suas músicas salvas para acesso sem internet
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="offline-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎵</div>
            <div className="stat-info">
              <div className="stat-value">{offlineMusics.length}</div>
              <div className="stat-label">Músicas Offline</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💾</div>
            <div className="stat-info">
              <div className="stat-value">{formatSize(totalSize)}</div>
              <div className="stat-label">Espaço Usado</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-value">{uniqueArtists}</div>
              <div className="stat-label">Artistas</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-value">{formatSize(averageSize)}</div>
              <div className="stat-label">Tamanho Médio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="offline-controls">
        <div className="search-section">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar músicas offline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="controls-section">
          <div className="filter-group">
            <label>Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="filter-select"
            >
              <option value="recent">Mais Recente</option>
              <option value="title">Título</option>
              <option value="artist">Artista</option>
              <option value="size">Tamanho</option>
            </select>
          </div>

          <div className="view-toggles">
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <span className="btn-icon">📋</span>
              Lista
            </button>
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <span className="btn-icon">⊞</span>
              Grade
            </button>
          </div>

          {offlineMusics.length > 0 && (
            <button
              onClick={handleClearAll}
              className="btn btn-danger clear-all-btn"
            >
              <span className="btn-icon">🗑️</span>
              Limpar Todas
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="offline-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-icon">⏳</div>
            <h3>Carregando músicas offline...</h3>
            <p>Aguarde enquanto verificamos suas músicas salvas</p>
          </div>
        ) : filteredAndSortedMusics.length === 0 ? (
          <div className="empty-state">
            {searchTerm ? (
              <>
                <div className="empty-icon">🔍</div>
                <h3>Nenhuma música encontrada</h3>
                <p>
                  Não encontramos músicas offline que correspondam à sua busca
                  por "{searchTerm}"
                </p>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSearchTerm("")}
                >
                  Limpar Busca
                </button>
              </>
            ) : (
              <>
                <div className="empty-icon">📱</div>
                <h3>Nenhuma música offline ainda</h3>
                <p>
                  Salve suas músicas favoritas para acessá-las sem internet!
                </p>
                <div className="empty-tips">
                  <h4>Como usar offline:</h4>
                  <ul>
                    <li>🔍 Encontre uma música na busca</li>
                    <li>📥 Toque no botão de download (↓)</li>
                    <li>📱 A música fica salva no seu dispositivo</li>
                    <li>🌐 Acesse mesmo sem internet!</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className={`music-list ${viewMode}`}>
            {filteredAndSortedMusics.map((music) => (
              <div className="music-card" key={music.id}>
                <div className="music-info">
                  <div className="music-header">
                    <h3 className="music-title">{music.title}</h3>
                    <div className="music-badges">
                      <span className="offline-badge-small">
                        <span className="badge-dot"></span>
                        OFFLINE
                      </span>
                      <span className="size-badge">
                        {formatSize(music.content?.length || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="music-details">
                    {music.artist && (
                      <span className="music-artist">
                        <span className="detail-icon">👤</span>
                        {music.artist}
                      </span>
                    )}
                    <span className="music-date">
                      <span className="detail-icon">📅</span>
                      Salvo em{" "}
                      {music.created_at
                        ? new Date(music.created_at).toLocaleDateString()
                        : "Data desconhecida"}
                    </span>
                  </div>
                </div>

                <div className="music-actions">
                  <button
                    onClick={() => selectMusic(music)}
                    className="btn btn-primary view-btn-card"
                  >
                    <span className="btn-icon">👁️</span>
                    Visualizar
                  </button>
                  <button
                    onClick={() => handleRemoveMusic(music.id)}
                    className="btn btn-danger remove-btn"
                  >
                    <span className="btn-icon">🗑️</span>
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informações de Uso */}
      {offlineMusics.length > 0 && (
        <div className="offline-info">
          <div className="section-header">
            <span className="section-icon">💡</span>
            <h2>Como Funciona o Modo Offline</h2>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">💾</div>
              <h4>Armazenamento Local</h4>
              <p>
                As músicas são salvas diretamente no seu dispositivo, ocupando
                espaço no navegador.
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">🌐</div>
              <h4>Acesso Sem Internet</h4>
              <p>
                Funciona perfeitamente mesmo quando você está offline ou sem
                conexão.
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">🔄</div>
              <h4>Sincronização</h4>
              <p>
                Quando online, as músicas são sincronizadas automaticamente com
                o servidor.
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">🗂️</div>
              <h4>Gerenciamento</h4>
              <p>
                Você pode remover músicas individualmente para liberar espaço
                quando necessário.
              </p>
            </div>
          </div>

          <div className="storage-info">
            <h4>Informações de Armazenamento:</h4>
            <div className="storage-details">
              <div className="storage-item">
                <span className="storage-label">Total usado:</span>
                <span className="storage-value">{formatSize(totalSize)}</span>
              </div>
              <div className="storage-item">
                <span className="storage-label">Músicas salvas:</span>
                <span className="storage-value">{offlineMusics.length}</span>
              </div>
              <div className="storage-item">
                <span className="storage-label">Espaço médio por música:</span>
                <span className="storage-value">{formatSize(averageSize)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
