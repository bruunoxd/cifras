import { useState } from "react";
import { songService, playlistService } from "../store/supabase";
import "./Backup.css";

async function exportData() {
  try {
    const [songs, playlists] = await Promise.all([
      songService.getAll(),
      playlistService.getAll(),
    ]);

    const payload = {
      songs,
      playlists,
      version: 2,
      exportedAt: new Date().toISOString(),
      source: "supabase",
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cifras_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Erro no backup:", error);
    throw error;
  }
}

async function importData(file: File) {
  const text = await file.text();
  const parsed = JSON.parse(text);

  if (!parsed || !Array.isArray(parsed.songs)) {
    throw new Error("Arquivo de backup inválido");
  }

  // Importar músicas
  for (const song of parsed.songs) {
    // Remove ID para criar novo registro
    const { id, created_at, updated_at, ...songData } = song;
    await songService.create(songData);
  }

  // Importar playlists
  if (Array.isArray(parsed.playlists)) {
    for (const playlist of parsed.playlists) {
      const { id, created_at, updated_at, ...playlistData } = playlist;
      await playlistService.create(playlistData);
    }
  }
}

export default function Backup() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      setStatus("Exportando dados...");
      await exportData();
      setStatus("Backup realizado com sucesso!");
    } catch (error: any) {
      setStatus(`Erro ao fazer backup: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (file: File) => {
    if (
      !confirm(
        "Isso importará dados e pode duplicar músicas existentes. Deseja continuar?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setStatus("Importando dados...");
      await importData(file);
      setStatus("Dados importados com sucesso!");
    } catch (error: any) {
      setStatus(`Erro ao importar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusType = () => {
    if (status.includes("sucesso")) return "success";
    if (status.includes("Erro")) return "error";
    if (loading) return "info";
    return "info";
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="icon">💾</span>
            Backup e Restauração
          </h1>
          <p className="page-subtitle">
            Gerencie suas músicas e playlists com segurança
          </p>
        </div>
      </div>

      <div className="backup-grid">
        <div className="backup-card cloud-card">
          <div className="card-icon">☁️</div>
          <h3>Backup na Nuvem</h3>
          <p>
            Seus dados são automaticamente salvos na nuvem quando você está
            logado. Não é necessário fazer backup manual, mas você pode exportar
            para ter uma cópia local.
          </p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              Sincronização automática
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔄</span>
              Atualizações em tempo real
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌐</span>
              Acesso de qualquer dispositivo
            </div>
          </div>
        </div>

        <div className="backup-card export-card">
          <div className="card-icon">📥</div>
          <h3>Exportar Dados</h3>
          <p>
            Baixe uma cópia de todas as suas músicas e playlists em formato
            JSON.
          </p>
          <div className="backup-stats">
            <div className="stat-item">
              <span className="stat-label">Formato:</span>
              <span className="stat-value">JSON</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Inclui:</span>
              <span className="stat-value">Músicas + Playlists</span>
            </div>
          </div>
          <button
            className="btn btn-primary backup-btn"
            onClick={handleExport}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Exportando...
              </>
            ) : (
              <>
                <span className="icon">💾</span>
                Fazer Backup
              </>
            )}
          </button>
        </div>

        <div className="backup-card import-card">
          <div className="card-icon">📤</div>
          <h3>Importar Dados</h3>
          <p>Restaure músicas e playlists de um arquivo de backup anterior.</p>
          <div className="import-warning">
            <span className="warning-icon">⚠️</span>
            <small>Pode duplicar músicas existentes</small>
          </div>
          <label className="file-input-wrapper">
            <input
              type="file"
              accept="application/json,.json"
              className="file-input"
              disabled={loading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImport(file);
              }}
            />
            <button className="btn btn-secondary backup-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Importando...
                </>
              ) : (
                <>
                  <span className="icon">📂</span>
                  Restaurar Backup
                </>
              )}
            </button>
          </label>
        </div>
      </div>

      {status && (
        <div className={`alert alert-${getStatusType()}`}>
          <span className="alert-icon">
            {getStatusType() === "success"
              ? "✅"
              : getStatusType() === "error"
              ? "❌"
              : "ℹ️"}
          </span>
          {status}
        </div>
      )}

      <div className="tips-section">
        <div className="tips-header">
          <h3>
            <span className="icon">💡</span>
            Dicas Importantes
          </h3>
        </div>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">☁️</div>
            <h4>Backup Automático</h4>
            <p>Dados são salvos automaticamente na nuvem quando logado</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">💾</div>
            <h4>Backup Local</h4>
            <p>Use "Fazer backup" para ter uma cópia no seu dispositivo</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔄</div>
            <h4>Sincronização</h4>
            <p>Faça login nos seus dispositivos para acessar os mesmos dados</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📱</div>
            <h4>Modo Offline</h4>
            <p>O app funciona offline, sincroniza quando voltar online</p>
          </div>
        </div>
      </div>
    </div>
  );
}
