import { useState, useEffect } from "react";
import { isOfflineModeActive } from "../store/supabase";
import { FavoritesService } from "../store/favorites";
import "./Favoritos.css";

export default function Favoritos() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);

      // Usar o sistema de favoritos compartilhado
      const favoriteSongs = await FavoritesService.getFavoriteSongs();
      setFavorites(favoriteSongs);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (songId: number) => {
    FavoritesService.removeFavorite(songId);
    loadFavorites(); // Recarregar lista
  };

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
              <p>
                Sistema de favoritos disponível apenas com Supabase configurado
              </p>
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
                  ? "Configure o Supabase para usar favoritos"
                  : "Adicione músicas aos favoritos para vê-las aqui"}
              </p>
            </div>
          ) : (
            favorites.map((favorite) => (
              <div key={favorite.id} className="favorite-card">
                <div className="favorite-info">
                  <h3>{favorite.title}</h3>
                  <p>{favorite.artist}</p>
                  <span className="favorite-badge">❤️ Favorita</span>
                </div>
                <div className="favorite-actions">
                  <button
                    className="btn-secondary btn-small"
                    onClick={() => removeFavorite(favorite.id!)}
                    title="Remover dos favoritos"
                    style={{ color: "#ef4444" }}
                  >
                    💔
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
