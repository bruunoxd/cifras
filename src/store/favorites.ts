// Sistema de favoritos usando localStorage para modo offline
// e sincronização com Supabase quando disponível

import { Song, isOfflineModeActive, songService } from "./supabase";

const FAVORITES_KEY = "cifras_favorites";

// Gerenciar favoritos no localStorage
export class FavoritesService {
  // Obter lista de IDs dos favoritos
  static getFavoriteIds(): number[] {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Salvar lista de IDs dos favoritos
  static setFavoriteIds(ids: number[]): void {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  }

  // Adicionar música aos favoritos
  static addFavorite(songId: number): void {
    const favorites = this.getFavoriteIds();
    if (!favorites.includes(songId)) {
      favorites.push(songId);
      this.setFavoriteIds(favorites);
    }
  }

  // Remover música dos favoritos
  static removeFavorite(songId: number): void {
    const favorites = this.getFavoriteIds();
    const filtered = favorites.filter((id) => id !== songId);
    this.setFavoriteIds(filtered);
  }

  // Verificar se música é favorita
  static isFavorite(songId: number): boolean {
    return this.getFavoriteIds().includes(songId);
  }

  // Obter músicas favoritas completas
  static async getFavoriteSongs(): Promise<Song[]> {
    try {
      const favoriteIds = this.getFavoriteIds();
      if (favoriteIds.length === 0) return [];

      const allSongs = await songService.getAll();
      return allSongs.filter(
        (song) => song.id && favoriteIds.includes(song.id)
      );
    } catch (error) {
      console.error("Erro ao carregar músicas favoritas:", error);
      return [];
    }
  }

  // Inicializar favoritos com dados padrão (apenas na primeira vez)
  static initializeDefaultFavorites(): void {
    const existing = this.getFavoriteIds();
    if (existing.length === 0) {
      // Adicionar as primeiras 2 músicas como favoritas por padrão
      this.setFavoriteIds([1, 2]);
    }
  }

  // Alternar estado de favorito
  static toggleFavorite(songId: number): boolean {
    if (this.isFavorite(songId)) {
      this.removeFavorite(songId);
      return false;
    } else {
      this.addFavorite(songId);
      return true;
    }
  }

  // Contar total de favoritos
  static getFavoritesCount(): number {
    return this.getFavoriteIds().length;
  }
}

// Inicializar favoritos padrão quando o módulo for carregado
if (isOfflineModeActive) {
  FavoritesService.initializeDefaultFavorites();
}
