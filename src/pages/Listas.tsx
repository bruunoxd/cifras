import { useEffect, useState } from "react";
import {
  playlistService,
  songService,
  Playlist,
  Song,
} from "../store/supabase";
import { FavoritesService } from "../store/favorites";
import "./Listas.css";

export default function Listas() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [playlistsData, songsData] = await Promise.all([
        playlistService.getAll(),
        songService.getAll(),
      ]);

      // Criar playlist de favoritos usando o sistema de favoritos compartilhado
      const favoriteIds = FavoritesService.getFavoriteIds();
      const favoritasPlaylist = {
        id: -1,
        name: "Favoritas",
        description: "Minhas músicas favoritas",
        song_ids: favoriteIds,
      };

      // Filtrar playlists existentes para evitar duplicatas de "Favoritas"
      const filteredPlaylists = playlistsData.filter(
        (p) => p.name !== "Favoritas"
      );

      setPlaylists([favoritasPlaylist, ...filteredPlaylists]);
      setSongs(songsData);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const addPlaylist = async () => {
    if (!name.trim()) return;

    try {
      await playlistService.create({ name, description, song_ids: [] });
      setName("");
      setDescription("");
      setShowForm(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Erro ao criar playlist");
    }
  };

  const deletePlaylist = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta playlist?")) return;

    try {
      await playlistService.delete(id);
      loadData();
    } catch (err: any) {
      setError(err.message || "Erro ao excluir playlist");
    }
  };

  const toggleSongInPlaylist = async (playlist: Playlist, songId: number) => {
    // Se for a playlist de favoritos, usar o sistema de favoritos
    if (playlist.id === -1 && playlist.name === "Favoritas") {
      FavoritesService.toggleFavorite(songId);
      loadData(); // Recarregar para atualizar a UI
      return;
    }

    // Para playlists normais, usar o sistema original
    const songIds = playlist.song_ids || [];
    const newSongIds = songIds.includes(songId)
      ? songIds.filter((id) => id !== songId)
      : [...songIds, songId];

    try {
      await playlistService.update(playlist.id!, { song_ids: newSongIds });
      loadData();
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar playlist");
    }
  };

  const getPlaylistSongs = (playlist: Playlist): Song[] => {
    if (!playlist.song_ids) return [];
    return songs.filter((song) => playlist.song_ids.includes(song.id!));
  };

  const filteredPlaylists = playlists.filter(
    (p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(q.toLowerCase()))
  );

  if (loading && playlists.length === 0) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando playlists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Minhas listas</h1>
          <p>Organize suas músicas em playlists personalizadas</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <span>+</span> Nova Lista
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError("")} className="error-close">
            ×
          </button>
        </div>
      )}

      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Buscar listas..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando listas...</p>
        </div>
      ) : (
        <div className="listas-grid">
          {filteredPlaylists.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎵</div>
              <h3>Nenhuma lista encontrada</h3>
              <p>{q ? "Tente outra busca" : "Crie sua primeira playlist"}</p>
              {!q && (
                <button
                  className="btn-primary"
                  onClick={() => setShowForm(true)}
                >
                  <span>+</span> Criar Lista
                </button>
              )}
            </div>
          ) : (
            filteredPlaylists.map((playlist) => {
              const playlistSongs = getPlaylistSongs(playlist);
              const isFavoritas = playlist.name === "Favoritas";
              return (
                <div
                  key={playlist.id}
                  className={`lista-card ${isFavoritas ? "favoritas" : ""}`}
                >
                  <div className="lista-header">
                    <div className="lista-info">
                      <h3 className="lista-title">
                        {isFavoritas && (
                          <span style={{ marginRight: "0.5rem" }}>❤️</span>
                        )}
                        {playlist.name}
                      </h3>
                      {playlist.description && (
                        <p className="lista-description">
                          {playlist.description}
                        </p>
                      )}
                      <span className="lista-count">
                        {playlistSongs.length} música
                        {playlistSongs.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="lista-actions">
                      {!isFavoritas && (
                        <button
                          className="btn-secondary"
                          onClick={() => deletePlaylist(playlist.id!)}
                          title="Excluir"
                          style={{ color: "#ef4444" }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Músicas na playlist */}
                  {playlistSongs.length > 0 && (
                    <div className="lista-songs">
                      <h4>Músicas nesta lista:</h4>
                      <div className="songs-list">
                        {playlistSongs.map((song) => (
                          <div key={song.id} className="song-item">
                            <div className="song-item-info">
                              <span className="song-item-title">
                                {song.title}
                              </span>
                              <span className="song-item-artist">
                                — {song.artist}
                              </span>
                            </div>
                            <button
                              className="btn-secondary btn-small"
                              onClick={() =>
                                toggleSongInPlaylist(playlist, song.id!)
                              }
                              title="Remover"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Adicionar músicas */}
                  <div className="lista-manage">
                    <details className="manage-details">
                      <summary className="manage-summary">
                        ▶ Adicionar/remover músicas
                      </summary>
                      <div className="manage-content">
                        {songs.length > 0 ? (
                          <div className="songs-checkbox-list">
                            {songs.map((song) => {
                              const isInPlaylist =
                                playlist.song_ids?.includes(song.id!) || false;
                              return (
                                <label key={song.id} className="checkbox-item">
                                  <input
                                    type="checkbox"
                                    checked={isInPlaylist}
                                    onChange={() =>
                                      toggleSongInPlaylist(playlist, song.id!)
                                    }
                                  />
                                  <span className="checkbox-label">
                                    {song.title} — {song.artist}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="no-songs-message">
                            Nenhuma música disponível. Adicione músicas
                            primeiro.
                          </p>
                        )}
                      </div>
                    </details>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal de Nova Lista */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nova Lista</h3>
              <button
                onClick={() => setShowForm(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <div className="form-container">
              <div className="form-group">
                <label>Nome da lista *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome da lista"
                />
              </div>

              <div className="form-group">
                <label>Descrição (opcional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição da lista"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={addPlaylist}
                  className="submit-btn"
                  disabled={!name.trim()}
                >
                  Criar Lista
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
