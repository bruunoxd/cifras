import { useState } from "react";
import { loadPrefs, savePrefs } from "../store/prefs";
import PaymentForm from "../components/PaymentForm";
import "./Assinatura.css";

export default function Assinatura() {
  const [sub, setSub] = useState(loadPrefs().subscribed);
  const [showPayment, setShowPayment] = useState(false);

  const handleSubscribe = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setSub(true);
    setShowPayment(false);

    // Mostrar mensagem de sucesso mais elaborada
    setTimeout(() => {
      const prefs = loadPrefs();
      const welcomeMessage = `🎉 Pagamento aprovado!\n\n✅ Bem-vindo ao Cifras Premium!\n\n🎵 Agora você tem acesso a:\n• Músicas ilimitadas\n• Backup automático\n• Ferramentas avançadas\n• E muito mais!\n\nObrigado por escolher o Cifras Premium!`;
      alert(welcomeMessage);
    }, 500);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const cancel = () => {
    const p = loadPrefs();
    p.subscribed = false;
    savePrefs(p);
    setSub(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="icon">⭐</span>
            Cifras Premium
          </h1>
          <p className="page-subtitle">
            Desbloqueie todo o potencial do seu app de cifras
          </p>
        </div>
      </div>

      {sub ? (
        <div className="subscription-active">
          <div className="active-card">
            <div className="success-icon">✅</div>
            <h2>Você é Premium!</h2>
            <p>Aproveite todos os recursos exclusivos sem limitações</p>

            {(() => {
              const prefs = loadPrefs();
              return (
                <div className="subscription-details">
                  {prefs.subscriptionDate && (
                    <p className="subscription-date">
                      Assinatura ativa desde:{" "}
                      {new Date(prefs.subscriptionDate).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  )}
                  {prefs.paymentMethod && (
                    <p className="payment-info">
                      Cartão {prefs.paymentMethod.cardBrand.toUpperCase()} ****
                      {prefs.paymentMethod.lastFour}
                    </p>
                  )}
                </div>
              );
            })()}

            <div className="premium-benefits active">
              <h3>Recursos Premium Ativos:</h3>
              <div className="benefits-grid">
                <div className="benefit-item active">
                  <span className="benefit-icon">🚫</span>
                  <span>Sem anúncios</span>
                </div>
                <div className="benefit-item active">
                  <span className="benefit-icon">☁️</span>
                  <span>Backup ilimitado</span>
                </div>
                <div className="benefit-item active">
                  <span className="benefit-icon">🎵</span>
                  <span>Músicas ilimitadas</span>
                </div>
                <div className="benefit-item active">
                  <span className="benefit-icon">📱</span>
                  <span>Sync multi-dispositivos</span>
                </div>
                <div className="benefit-item active">
                  <span className="benefit-icon">🎨</span>
                  <span>Temas exclusivos</span>
                </div>
                <div className="benefit-item active">
                  <span className="benefit-icon">🔧</span>
                  <span>Ferramentas avançadas</span>
                </div>
              </div>
            </div>

            <div className="subscription-actions">
              <button className="btn btn-secondary" onClick={cancel}>
                <span className="icon">🔄</span>
                Cancelar Assinatura
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="subscription-plans">
          <div className="plans-header">
            <h2>Escolha seu plano</h2>
            <p>Remova anúncios e desbloqueie recursos exclusivos</p>
          </div>

          <div className="plans-grid">
            <div className="plan-card free-plan">
              <div className="plan-header">
                <h3>Gratuito</h3>
                <div className="plan-price">
                  <span className="price">R$ 0</span>
                  <span className="period">/mês</span>
                </div>
              </div>

              <div className="plan-features">
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>Até 50 músicas</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>3 playlists</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>Busca básica</span>
                </div>
                <div className="feature-item limited">
                  <span className="feature-icon">📺</span>
                  <span>Com anúncios</span>
                </div>
                <div className="feature-item limited">
                  <span className="feature-icon">💾</span>
                  <span>Backup limitado</span>
                </div>
              </div>

              <div className="plan-status">
                <span className="current-plan">Plano Atual</span>
              </div>
            </div>

            <div className="plan-card premium-plan featured">
              <div className="plan-badge">Mais Popular</div>
              <div className="plan-header">
                <h3>Premium</h3>
                <div className="plan-price">
                  <span className="price">R$ 9,90</span>
                  <span className="period">/mês</span>
                </div>
                <div className="price-note">
                  <del>R$ 19,90</del> <span className="discount">50% OFF</span>
                </div>
              </div>

              <div className="plan-features">
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>Músicas ilimitadas</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>Playlists ilimitadas</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>Busca avançada</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🚫</span>
                  <span>Sem anúncios</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">☁️</span>
                  <span>Backup ilimitado</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span>Sync multi-dispositivos</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎨</span>
                  <span>Temas exclusivos</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔧</span>
                  <span>Ferramentas avançadas</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Transposição automática</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span>Estatísticas detalhadas</span>
                </div>
              </div>

              <button
                className="btn btn-primary plan-btn"
                onClick={handleSubscribe}
              >
                <span className="icon">⭐</span>
                Assinar Premium
              </button>
            </div>
          </div>

          <div className="benefits-showcase">
            <h3>Por que escolher o Premium?</h3>
            <div className="showcase-grid">
              <div className="showcase-item">
                <div className="showcase-icon">🚫</div>
                <h4>Experiência Sem Anúncios</h4>
                <p>Foque apenas na música, sem interrupções ou distrações</p>
              </div>

              <div className="showcase-item">
                <div className="showcase-icon">☁️</div>
                <h4>Backup Automático</h4>
                <p>
                  Suas cifras sempre seguras na nuvem, acessíveis de qualquer
                  lugar
                </p>
              </div>

              <div className="showcase-item">
                <div className="showcase-icon">🎵</div>
                <h4>Biblioteca Ilimitada</h4>
                <p>Adicione quantas músicas quiser, sem limitações</p>
              </div>

              <div className="showcase-item">
                <div className="showcase-icon">🔧</div>
                <h4>Ferramentas Profissionais</h4>
                <p>Transposição automática, metronômo e muito mais</p>
              </div>
            </div>
          </div>

          <div className="guarantee-section">
            <div className="guarantee-content">
              <span className="guarantee-icon">🛡️</span>
              <div>
                <h4>Garantia de 7 dias</h4>
                <p>
                  Não ficou satisfeito? Cancelamos e devolvemos seu dinheiro,
                  sem perguntas!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPayment && (
        <PaymentForm
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  );
}
