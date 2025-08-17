import { useState } from "react";
import { songService, Song } from "../store/supabase";
import "./Buscar.css";

export default function Buscar() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  const handleSearch = async () => {
    if (!q.trim()) {
      setSongs([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const results = await songService.search(q);
      setSongs(results);
    } catch (err: any) {
      setError(err.message || "Erro na busca");
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQ("");
    setSongs([]);
    setError("");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "fácil":
      case "facil":
        return "success";
      case "médio":
      case "medio":
        return "warning";
      case "difícil":
      case "dificil":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="icon">🔍</span>
            Procurar Música
          </h1>
          <p className="page-subtitle">
            Encontre músicas por título, artista, letra ou acordes
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="search-section">
        <div className="search-container">
          <div className="search-input-group">
            <input
              type="text"
              className="search-input"
              placeholder="Digite o que você está procurando..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="btn btn-primary search-btn"
              onClick={handleSearch}
              disabled={loading || !q.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Buscando...
                </>
              ) : (
                <>
                  <span className="icon">🔍</span>
                  Buscar
                </>
              )}
            </button>
            {q && (
              <button className="btn btn-secondary" onClick={clearSearch}>
                <span className="icon">✕</span>
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Buscando músicas...</p>
        </div>
      )}

      <div className="results-section">
        {songs.length > 0 && (
          <div className="results-header">
            <h3>Resultados da busca</h3>
            <span className="results-count">
              {songs.length} música(s) encontrada(s)
            </span>
          </div>
        )}

        <div className="songs-grid">
          {songs.map((song) => (
            <div className="song-card" key={song.id}>
              <div className="song-header">
                <div className="song-info">
                  <h3 className="song-title">{song.title}</h3>
                  {song.artist && <p className="song-artist">{song.artist}</p>}
                </div>
                <div className="song-badges">
                  {song.difficulty && (
                    <span
                      className={`badge badge-${getDifficultyColor(
                        song.difficulty
                      )}`}
                    >
                      {song.difficulty}
                    </span>
                  )}
                </div>
              </div>

              <div className="song-meta">
                {song.key && (
                  <div className="meta-item">
                    <span className="meta-label">Tom:</span>
                    <span className="meta-value">{song.key}</span>
                  </div>
                )}
                {(song.capo ?? 0) > 0 && (
                  <div className="meta-item">
                    <span className="meta-label">Capo:</span>
                    <span className="meta-value">{song.capo}</span>
                  </div>
                )}
                {song.genre && (
                  <div className="meta-item">
                    <span className="meta-label">Gênero:</span>
                    <span className="meta-value">{song.genre}</span>
                  </div>
                )}
              </div>

              {song.lyrics && (
                <div className="song-content">
                  <div className="content-header">
                    <span className="content-icon">📝</span>
                    <strong>Letra:</strong>
                  </div>
                  <div className="content-text lyrics-preview">
                    {song.lyrics}
                  </div>
                </div>
              )}

              {song.chords && (
                <div className="song-content">
                  <div className="content-header">
                    <span className="content-icon">🎸</span>
                    <strong>Acordes:</strong>
                  </div>
                  <div className="content-text chords-preview">
                    {song.chords}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {!loading && songs.length === 0 && q && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Nenhuma música encontrada</h3>
            <p>
              Não encontramos resultados para "<strong>{q}</strong>"
            </p>
            <div className="empty-suggestions">
              <p>Dicas para melhorar sua busca:</p>
              <ul>
                <li>Verifique a ortografia</li>
                <li>Tente termos mais gerais</li>
                <li>Use palavras-chave diferentes</li>
                <li>Busque por parte da letra ou acordes</li>
              </ul>
            </div>
          </div>
        )}

        {!q && (
          <div className="search-help">
            <div className="help-icon">💡</div>
            <h3>Como buscar</h3>
            <div className="search-tips">
              <div className="tip-item">
                <span className="tip-icon">🎵</span>
                <div>
                  <strong>Por título:</strong>
                  <p>Digite o nome da música</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">👤</span>
                <div>
                  <strong>Por artista:</strong>
                  <p>Nome do intérprete ou banda</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">📝</span>
                <div>
                  <strong>Por letra:</strong>
                  <p>Trecho da letra da música</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🎸</span>
                <div>
                  <strong>Por acordes:</strong>
                  <p>Sequência de acordes (Ex: C G Am F)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
