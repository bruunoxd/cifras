import { useState, useEffect } from "react";
import CifraViewer from "../components/CifraViewer";
import { songService, isOfflineModeActive, Song } from "../store/supabase";
import "./Musicas.css";

export default function Musicas() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [q, setQ] = useState("");

  // Formulário
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Song>>({
    title: "",
    artist: "",
    content: "",
    lyrics: "",
    chords: "",
    audioUrl: "",
  });

  // Transposição
  const [transposeSteps, setTransposeSteps] = useState(0);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await songService.getAll();
      setSongs(data);
    } catch (err) {
      console.error("Erro ao carregar músicas:", err);
      setError("Erro ao carregar músicas");
    } finally {
      setLoading(false);
    }
  };

  const searchSongs = async () => {
    if (!q.trim()) {
      loadSongs();
      return;
    }

    try {
      setLoading(true);
      const data = await songService.search(q);
      setSongs(data);
    } catch (err) {
      console.error("Erro na busca:", err);
      setError("Erro na busca");
    } finally {
      setLoading(false);
    }
  };

  const saveSong = async () => {
    if (!formData.title || !formData.artist) {
      setError("Título e artista são obrigatórios");
      return;
    }

    try {
      const songData = {
        ...formData,
        content: formData.content || "",
        lyrics: formData.lyrics || "",
        chords: formData.chords || "",
        audioUrl: formData.audioUrl || "",
      } as Omit<Song, "id" | "created_at" | "updated_at">;

      if (editingId) {
        await songService.update(editingId, songData);
      } else {
        await songService.create(songData);
      }

      handleCloseForm();
      loadSongs();
    } catch (err) {
      console.error("Erro ao salvar música:", err);
      setError("Erro ao salvar música");
    }
  };

  const handleEdit = (song: Song) => {
    setFormData(song);
    setEditingId(song.id!);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: "",
      artist: "",
      content: "",
      lyrics: "",
      chords: "",
      audioUrl: "",
    });
  };

  const handleNewSong = () => {
    // Limpa o formulário para nova música
    setFormData({
      title: "",
      artist: "",
      content: "",
      lyrics: "",
      chords: "",
      audioUrl: "",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const deleteSong = async (id: number) => {
    if (!confirm("Confirma exclusão?")) return;

    try {
      await songService.delete(id);
      loadSongs();
    } catch (err) {
      console.error("Erro ao deletar música:", err);
      setError("Erro ao deletar música");
    }
  };

  const selectSong = (song: Song) => {
    setSelectedSong(song);
    setTransposeSteps(0);
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(q.toLowerCase()) ||
      song.artist.toLowerCase().includes(q.toLowerCase())
  );

  if (selectedSong) {
    return (
      <CifraViewer
        title={selectedSong.title}
        artist={selectedSong.artist}
        lyrics={selectedSong.content || selectedSong.lyrics} // Usar content que tem os acordes formatados
        chords={selectedSong.chords}
        originalKey={selectedSong.key}
        transpose={transposeSteps}
        audioUrl={selectedSong.audioUrl} // Passar URL do áudio
        onTranspose={setTransposeSteps}
        onBack={() => setSelectedSong(null)} // Adicionar callback para voltar
      />
    );
  }

  return (
    <div className="page-container">
      {/* Aviso de modo offline */}
      {isOfflineModeActive && (
        <div className="offline-banner">
          <div className="offline-banner-content">
            <span className="offline-icon">🔌</span>
            <div>
              <strong>Modo Offline</strong>
              <p>
                Dados salvos localmente. Configure o Supabase para sincronização
                na nuvem.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <div className="header-top">
          <h1>🎵 Músicas</h1>
          <button className="btn-primary" onClick={handleNewSong}>
            <span>+</span> Nova Música
          </button>
        </div>

        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar músicas..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchSongs()}
              className="search-input"
            />
            <button onClick={searchSongs} className="search-btn">
              🔍
            </button>
          </div>
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

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando músicas...</p>
        </div>
      ) : (
        <div className="songs-grid">
          {filteredSongs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎼</div>
              <h3>Nenhuma música encontrada</h3>
              <p>{q ? "Tente outra busca" : "Adicione sua primeira música"}</p>
              {!q && (
                <button className="btn-primary" onClick={handleNewSong}>
                  <span>+</span> Adicionar Música
                </button>
              )}
            </div>
          ) : (
            filteredSongs.map((song) => (
              <div key={song.id} className="song-card">
                <div className="song-header">
                  <div className="song-info">
                    <h3 className="song-title">
                      {song.title}
                      {song.audioUrl && (
                        <span className="audio-indicator" title="Tem áudio">
                          🎵
                        </span>
                      )}
                    </h3>
                    <p className="song-artist">{song.artist}</p>
                    {song.key && (
                      <span className="song-key">Tom: {song.key}</span>
                    )}
                    {song.capo && song.capo > 0 && (
                      <span className="song-capo">Capo: {song.capo}ª casa</span>
                    )}
                  </div>
                  <div className="song-actions">
                    <button
                      onClick={() => selectSong(song)}
                      className="btn-secondary"
                      title="Visualizar"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleEdit(song)}
                      className="btn-secondary"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteSong(song.id!)}
                      className="btn-secondary"
                      title="Excluir"
                      style={{ color: "#ef4444" }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {song.difficulty && (
                  <div
                    className={`difficulty-badge difficulty-${song.difficulty}`}
                  >
                    {song.difficulty === "beginner" && "⭐ Iniciante"}
                    {song.difficulty === "intermediate" && "⭐⭐ Intermediário"}
                    {song.difficulty === "advanced" && "⭐⭐⭐ Avançado"}
                  </div>
                )}

                <div className="song-preview">
                  {song.content
                    .split("\n")
                    .slice(0, 3)
                    .map((line, i) => (
                      <div key={i} className="preview-line">
                        {line}
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal do Formulário */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? "Editar Música" : "Nova Música"}</h3>
              <button onClick={handleCloseForm} className="modal-close">
                ×
              </button>
            </div>

            <div className="form-container">
              <div className="form-row two-cols">
                <div className="form-group">
                  <label>Título *</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Nome da música"
                  />
                </div>
                <div className="form-group">
                  <label>Artista *</label>
                  <input
                    type="text"
                    value={formData.artist || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, artist: e.target.value })
                    }
                    placeholder="Nome do artista"
                  />
                </div>
              </div>

              <div className="form-row three-cols">
                <div className="form-group">
                  <label>Tom</label>
                  <select
                    value={formData.key || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, key: e.target.value })
                    }
                  >
                    <option value="">Selecione</option>
                    {[
                      "C",
                      "C#",
                      "D",
                      "D#",
                      "E",
                      "F",
                      "F#",
                      "G",
                      "G#",
                      "A",
                      "A#",
                      "B",
                    ].map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Capo</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={formData.capo || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capo: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Casa do capo"
                  />
                </div>
                <div className="form-group">
                  <label>Dificuldade</label>
                  <select
                    value={formData.difficulty || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as any,
                      })
                    }
                  >
                    <option value="">Selecione</option>
                    <option value="beginner">⭐ Iniciante</option>
                    <option value="intermediate">⭐⭐ Intermediário</option>
                    <option value="advanced">⭐⭐⭐ Avançado</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Letra</label>
                <textarea
                  value={formData.lyrics || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, lyrics: e.target.value })
                  }
                  placeholder="Letra da música..."
                  rows={6}
                />
              </div>

              <div className="form-group">
                <label>Acordes</label>
                <textarea
                  value={formData.chords || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, chords: e.target.value })
                  }
                  placeholder="Sequência de acordes: C G Am F..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>URL do Áudio (opcional)</label>
                <input
                  type="url"
                  value={formData.audioUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, audioUrl: e.target.value })
                  }
                  placeholder="https://exemplo.com/musica.mp3"
                />
                <small
                  style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}
                >
                  Cole a URL de um arquivo de áudio (MP3, WAV, etc.) para
                  sincronização com a cifra
                </small>
              </div>

              <div className="form-group">
                <label>Cifra Completa *</label>
                <textarea
                  value={formData.content || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Cole ou digite a cifra completa com acordes e letra..."
                  rows={10}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveSong}
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : editingId ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
