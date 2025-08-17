import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { Prefs } from "../store/prefs";
import "./Preferencias.css";

export default function Preferencias() {
  const { prefs, updatePrefs } = useTheme();
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handlePrefsChange = (newPrefs: any) => {
    updatePrefs(newPrefs);
    setShowSaveMessage(true);
    const timer = setTimeout(() => setShowSaveMessage(false), 2000);
    return () => clearTimeout(timer);
  };

  const handleResetPrefs = () => {
    if (confirm("Deseja realmente restaurar as configurações padrão?")) {
      const defaultPrefs: Prefs = {
        theme: "light",
        fontSize: 16,
        subscribed: false,
      };
      updatePrefs(defaultPrefs);
      setShowSaveMessage(true);
      const timer = setTimeout(() => setShowSaveMessage(false), 2000);
      return () => clearTimeout(timer);
    }
  };

  const themes = [
    { value: "light", label: "Claro", icon: "☀️" },
    { value: "dark", label: "Escuro", icon: "🌙" },
  ];

  const fontSizes = [
    { value: 12, label: "Muito Pequena" },
    { value: 14, label: "Pequena" },
    { value: 16, label: "Normal" },
    { value: 18, label: "Grande" },
    { value: 20, label: "Muito Grande" },
    { value: 24, label: "Extra Grande" },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="icon">⚙️</span>
            Preferências
          </h1>
          <p className="page-subtitle">
            Personalize sua experiência no CifrasNew
          </p>
        </div>
      </div>

      {showSaveMessage && (
        <div className="alert alert-success save-alert">
          <span className="alert-icon">✅</span>
          Configurações salvas automaticamente!
        </div>
      )}

      <div className="preferences-grid">
        {/* Aparência */}
        <div className="preference-section">
          <div className="section-header">
            <span className="section-icon">🎨</span>
            <h2>Aparência</h2>
          </div>

          <div className="preference-cards">
            <div className="preference-card">
              <div className="preference-header">
                <h3>Tema</h3>
                <p>Escolha entre tema claro ou escuro</p>
              </div>

              <div className="theme-selector">
                {themes.map((theme) => (
                  <button
                    key={theme.value}
                    className={`theme-option ${
                      prefs.theme === theme.value ? "active" : ""
                    }`}
                    onClick={() =>
                      handlePrefsChange({ theme: theme.value as any })
                    }
                  >
                    <span className="theme-icon">{theme.icon}</span>
                    <span className="theme-label">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="preference-card">
              <div className="preference-header">
                <h3>Tamanho da Fonte</h3>
                <p>Ajuste o tamanho do texto para melhor leitura</p>
              </div>

              <div className="font-size-selector">
                <div
                  className="font-size-preview"
                  style={{ fontSize: `${prefs.fontSize}px` }}
                >
                  Exemplo de texto com o tamanho selecionado
                </div>

                <div className="font-size-options">
                  {fontSizes.map((size) => (
                    <button
                      key={size.value}
                      className={`font-size-option ${
                        prefs.fontSize === size.value ? "active" : ""
                      }`}
                      onClick={() =>
                        handlePrefsChange({ fontSize: size.value })
                      }
                    >
                      <span className="size-value">{size.value}px</span>
                      <span className="size-label">{size.label}</span>
                    </button>
                  ))}
                </div>

                <div className="font-size-slider">
                  <label>Personalizado:</label>
                  <input
                    type="range"
                    min="10"
                    max="32"
                    value={prefs.fontSize}
                    onChange={(e) =>
                      handlePrefsChange({ fontSize: Number(e.target.value) })
                    }
                    className="slider"
                  />
                  <span className="slider-value">{prefs.fontSize}px</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conta */}
        <div className="preference-section">
          <div className="section-header">
            <span className="section-icon">👤</span>
            <h2>Conta</h2>
          </div>

          <div className="preference-cards">
            <div className="preference-card">
              <div className="preference-header">
                <h3>Assinatura</h3>
                <p>Status da sua assinatura Premium</p>
              </div>

              <div className="subscription-status">
                {prefs.subscribed ? (
                  <div className="status-active">
                    <span className="status-icon">⭐</span>
                    <div className="status-info">
                      <strong>Premium Ativo</strong>
                      <p>Aproveite todos os recursos!</p>
                    </div>
                  </div>
                ) : (
                  <div className="status-inactive">
                    <span className="status-icon">📦</span>
                    <div className="status-info">
                      <strong>Conta Gratuita</strong>
                      <p>Considere fazer upgrade para Premium</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dados */}
        <div className="preference-section">
          <div className="section-header">
            <span className="section-icon">💾</span>
            <h2>Dados</h2>
          </div>

          <div className="preference-cards">
            <div className="preference-card">
              <div className="preference-header">
                <h3>Configurações</h3>
                <p>Gerencie suas preferências</p>
              </div>

              <div className="data-actions">
                <button
                  className="btn btn-secondary"
                  onClick={handleResetPrefs}
                >
                  <span className="btn-icon">🔄</span>
                  Restaurar Padrões
                </button>

                <div className="action-info">
                  <small>
                    Isso restaurará todas as configurações para os valores
                    padrão
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações */}
        <div className="preference-section">
          <div className="section-header">
            <span className="section-icon">ℹ️</span>
            <h2>Informações</h2>
          </div>

          <div className="preference-cards">
            <div className="preference-card">
              <div className="preference-header">
                <h3>Sistema</h3>
                <p>Informações sobre o app e dispositivo</p>
              </div>

              <div className="system-info">
                <div className="info-item">
                  <span className="info-label">Navegador:</span>
                  <span className="info-value">
                    {navigator.userAgent.split(" ")[0]}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Plataforma:</span>
                  <span className="info-value">{navigator.platform}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Idioma:</span>
                  <span className="info-value">{navigator.language}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Local Storage:</span>
                  <span className="info-value">
                    {localStorage ? "Disponível" : "Não disponível"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
