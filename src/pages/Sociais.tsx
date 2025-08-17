import { useState } from "react";
import "./Sociais.css";

export default function Sociais() {
  const [shareText] = useState(
    "Descobri o CifrasNew! 🎵 O melhor app para organizar e tocar suas cifras favoritas!"
  );
  const [shareUrl] = useState("https://cifrasnew.app");
  const [copied, setCopied] = useState("");

  const handleShare = (platform: string, url: string) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  const shareLinks = [
    {
      name: "Facebook",
      icon: "📘",
      color: "#1877f2",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}&quote=${encodeURIComponent(shareText)}`,
      description: "Compartilhe com seus amigos no Facebook",
    },
    {
      name: "Twitter/X",
      icon: "🐦",
      color: "#1da1f2",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}`,
      description: "Publique um tweet sobre o CifrasNew",
    },
    {
      name: "WhatsApp",
      icon: "💬",
      color: "#25d366",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        shareText + " " + shareUrl
      )}`,
      description: "Envie para seus contatos no WhatsApp",
    },
    {
      name: "Telegram",
      icon: "✈️",
      color: "#0088cc",
      url: `https://t.me/share/url?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}`,
      description: "Compartilhe no Telegram",
    },
    {
      name: "LinkedIn",
      icon: "💼",
      color: "#0077b5",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      description: "Compartilhe profissionalmente no LinkedIn",
    },
    {
      name: "Reddit",
      icon: "🤖",
      color: "#ff4500",
      url: `https://reddit.com/submit?url=${encodeURIComponent(
        shareUrl
      )}&title=${encodeURIComponent(shareText)}`,
      description: "Poste no Reddit",
    },
  ];

  const features = [
    {
      title: "Compartilhe suas Playlists",
      description:
        "Mostre suas coleções de cifras favoritas para amigos músicos",
      icon: "🎵",
    },
    {
      title: "Divulgue suas Performances",
      description: "Compartilhe vídeos tocando as músicas do seu repertório",
      icon: "🎸",
    },
    {
      title: "Encontre Músicos",
      description: "Conecte-se com outros usuários e forme bandas ou grupos",
      icon: "👥",
    },
    {
      title: "Eventos Musicais",
      description: "Divulgue apresentações e eventos onde você vai tocar",
      icon: "🎤",
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="icon">🌐</span>
            Redes Sociais
          </h1>
          <p className="page-subtitle">
            Compartilhe sua paixão pela música com o mundo
          </p>
        </div>
      </div>

      <div className="social-grid">
        {/* Compartilhamento Direto */}
        <div className="social-section">
          <div className="section-header">
            <span className="section-icon">🚀</span>
            <h2>Compartilhar CifrasNew</h2>
          </div>

          <div className="share-message">
            <div className="message-preview">
              <h3>Mensagem de compartilhamento:</h3>
              <div className="message-content">
                <p>"{shareText}"</p>
                <div className="message-actions">
                  <button
                    className="btn btn-text copy-btn"
                    onClick={() => copyToClipboard(shareText, "message")}
                  >
                    {copied === "message" ? "✅ Copiado!" : "📋 Copiar"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="share-platforms">
            {shareLinks.map((platform) => (
              <button
                key={platform.name}
                className="platform-btn"
                onClick={() => handleShare(platform.name, platform.url)}
                style={{ "--platform-color": platform.color } as any}
              >
                <div className="platform-icon">{platform.icon}</div>
                <div className="platform-info">
                  <h4>{platform.name}</h4>
                  <p>{platform.description}</p>
                </div>
                <div className="platform-arrow">→</div>
              </button>
            ))}
          </div>
        </div>

        {/* Links Úteis */}
        <div className="social-section">
          <div className="section-header">
            <span className="section-icon">🔗</span>
            <h2>Links para Compartilhar</h2>
          </div>

          <div className="link-cards">
            <div className="link-card">
              <div className="link-header">
                <span className="link-icon">🌐</span>
                <h3>Site do App</h3>
              </div>
              <div className="link-content">
                <code className="link-url">{shareUrl}</code>
                <button
                  className="btn btn-secondary copy-link-btn"
                  onClick={() => copyToClipboard(shareUrl, "site")}
                >
                  {copied === "site" ? "✅" : "📋"}
                </button>
              </div>
            </div>

            <div className="link-card">
              <div className="link-header">
                <span className="link-icon">📱</span>
                <h3>Download do App</h3>
              </div>
              <div className="link-content">
                <code className="link-url">https://cifrasnew.app/download</code>
                <button
                  className="btn btn-secondary copy-link-btn"
                  onClick={() =>
                    copyToClipboard(
                      "https://cifrasnew.app/download",
                      "download"
                    )
                  }
                >
                  {copied === "download" ? "✅" : "📋"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recursos Sociais */}
        <div className="social-section">
          <div className="section-header">
            <span className="section-icon">✨</span>
            <h2>Recursos Sociais</h2>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Integração Futura */}
        <div className="social-section">
          <div className="section-header">
            <span className="section-icon">🔮</span>
            <h2>Em Breve</h2>
          </div>

          <div className="coming-soon">
            <div className="coming-soon-card">
              <div className="coming-soon-icon">🎯</div>
              <h3>Integrações Nativas</h3>
              <p>
                Em breve você poderá conectar diretamente suas contas das redes
                sociais ao CifrasNew para compartilhamentos automáticos e
                descoberta de conteúdo musical.
              </p>

              <div className="upcoming-features">
                <div className="upcoming-item">
                  <span className="upcoming-icon">🔄</span>
                  <span>Compartilhamento automático</span>
                </div>
                <div className="upcoming-item">
                  <span className="upcoming-icon">👥</span>
                  <span>Seguir outros músicos</span>
                </div>
                <div className="upcoming-item">
                  <span className="upcoming-icon">🎵</span>
                  <span>Feed de músicas</span>
                </div>
                <div className="upcoming-item">
                  <span className="upcoming-icon">❤️</span>
                  <span>Curtir e comentar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="qr-section">
        <div className="qr-card">
          <div className="qr-content">
            <div className="qr-info">
              <h3>Compartilhe via QR Code</h3>
              <p>
                Outras pessoas podem escanear este código para acessar o
                CifrasNew rapidamente
              </p>
            </div>
            <div className="qr-placeholder">
              <div className="qr-icon">📱</div>
              <p>QR Code será gerado aqui</p>
              <small>Funcionalidade em desenvolvimento</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
