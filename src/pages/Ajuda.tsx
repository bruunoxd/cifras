import "./Ajuda.css";

export default function Ajuda() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="icon">❓</span>
            Central de Ajuda
          </h1>
          <p className="page-subtitle">
            Aprenda a usar todas as funcionalidades do CifrasNew
          </p>
        </div>
      </div>

      <div className="help-grid">
        <div className="help-section">
          <div className="section-header">
            <span className="section-icon">🎵</span>
            <h2>Gerenciando Músicas</h2>
          </div>

          <div className="help-cards">
            <div className="help-card">
              <div className="help-step">1</div>
              <h3>Adicionar Músicas</h3>
              <p>
                Vá para "Minhas Músicas" e clique em "Adicionar Nova". Preencha
                os detalhes da música, incluindo título, artista, cifra e letra.
              </p>
              <div className="help-tips">
                <span className="tip-icon">💡</span>
                <small>
                  Dica: Use a formatação de cifras para melhor visualização
                </small>
              </div>
            </div>

            <div className="help-card">
              <div className="help-step">2</div>
              <h3>Importar Arquivos</h3>
              <p>
                Importe arquivos .txt com suas cifras. O app reconhece
                automaticamente o formato e organiza o conteúdo.
              </p>
              <div className="help-tips">
                <span className="tip-icon">📁</span>
                <small>Formatos aceitos: .txt, .chord, .pro</small>
              </div>
            </div>

            <div className="help-card">
              <div className="help-step">3</div>
              <h3>Organizar por Dificuldade</h3>
              <p>
                Classifique suas músicas por nível de dificuldade: Fácil, Médio
                ou Difícil para melhor organização.
              </p>
              <div className="help-tips">
                <span className="tip-icon">🎯</span>
                <small>Use filtros para encontrar músicas do seu nível</small>
              </div>
            </div>
          </div>
        </div>

        <div className="help-section">
          <div className="section-header">
            <span className="section-icon">📋</span>
            <h2>Criando Playlists</h2>
          </div>

          <div className="help-cards">
            <div className="help-card">
              <div className="help-step">1</div>
              <h3>Nova Playlist</h3>
              <p>
                Em "Minhas Listas", crie uma nova playlist com nome e descrição.
                Organize suas músicas por temas, estilos ou ocasiões.
              </p>
            </div>

            <div className="help-card">
              <div className="help-step">2</div>
              <h3>Adicionar Músicas</h3>
              <p>
                Selecione as músicas que deseja incluir na playlist. Você pode
                adicionar ou remover músicas a qualquer momento.
              </p>
            </div>

            <div className="help-card">
              <div className="help-step">3</div>
              <h3>Gerenciar Listas</h3>
              <p>
                Edite, renomeie ou exclua playlists conforme necessário.
                Mantenha sua biblioteca organizada.
              </p>
            </div>
          </div>
        </div>

        <div className="help-section">
          <div className="section-header">
            <span className="section-icon">🔍</span>
            <h2>Busca Avançada</h2>
          </div>

          <div className="search-help-grid">
            <div className="search-type">
              <div className="help-search-icon">🎵</div>
              <h4>Por Título</h4>
              <p>Digite o nome da música para encontrá-la rapidamente</p>
              <div className="example">Ex: "Imagine"</div>
            </div>

            <div className="search-type">
              <div className="help-search-icon">👤</div>
              <h4>Por Artista</h4>
              <p>Busque por nome do intérprete ou banda</p>
              <div className="example">Ex: "Beatles"</div>
            </div>

            <div className="search-type">
              <div className="help-search-icon">📝</div>
              <h4>Por Letra</h4>
              <p>Encontre músicas por trechos da letra</p>
              <div className="example">Ex: "imagine all the people"</div>
            </div>

            <div className="search-type">
              <div className="help-search-icon">🎸</div>
              <h4>Por Acordes</h4>
              <p>Busque por sequências de acordes</p>
              <div className="example">Ex: "C G Am F"</div>
            </div>
          </div>
        </div>

        <div className="help-section">
          <div className="section-header">
            <span className="section-icon">💾</span>
            <h2>Backup e Sincronização</h2>
          </div>

          <div className="backup-help">
            <div className="backup-feature">
              <span className="feature-icon">☁️</span>
              <div>
                <h4>Backup Automático</h4>
                <p>
                  Seus dados são salvos automaticamente na nuvem quando você
                  está logado. Sem perda de dados!
                </p>
              </div>
            </div>

            <div className="backup-feature">
              <span className="feature-icon">📱</span>
              <div>
                <h4>Múltiplos Dispositivos</h4>
                <p>
                  Acesse suas músicas em qualquer dispositivo fazendo login com
                  a mesma conta.
                </p>
              </div>
            </div>

            <div className="backup-feature">
              <span className="feature-icon">📥</span>
              <div>
                <h4>Export Local</h4>
                <p>
                  Faça backup local de seus dados para ter uma cópia de
                  segurança no seu dispositivo.
                </p>
              </div>
            </div>

            <div className="backup-feature">
              <span className="feature-icon">🔄</span>
              <div>
                <h4>Modo Offline</h4>
                <p>
                  Continue usando o app mesmo sem internet. Os dados sincronizam
                  quando voltar online.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="help-section faq-section">
          <div className="section-header">
            <span className="section-icon">🤔</span>
            <h2>Perguntas Frequentes</h2>
          </div>

          <div className="faq-list">
            <details className="faq-item">
              <summary>Como funciona a formatação de cifras?</summary>
              <div className="faq-content">
                <p>
                  O CifrasNew reconhece automaticamente acordes entre colchetes
                  [C] ou parênteses (G). Você também pode usar a notação
                  tradicional onde os acordes ficam acima das palavras.
                </p>
                <div className="code-example">
                  <code>
                    [C]Imagine [G]all the [Am]people [F]living
                    <br />
                    Living for to[C]day
                  </code>
                </div>
              </div>
            </details>

            <details className="faq-item">
              <summary>Posso usar o app sem internet?</summary>
              <div className="faq-content">
                <p>
                  Sim! O CifrasNew funciona completamente offline. Suas músicas
                  ficam armazenadas localmente e sincronizam automaticamente
                  quando você se conecta à internet.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary>Como importar minhas cifras existentes?</summary>
              <div className="faq-content">
                <p>
                  Você pode importar arquivos .txt individuais ou fazer upload
                  de um backup JSON. Vá para "Backup e Restauração" para
                  importar dados de outros aplicativos.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary>Meus dados estão seguros?</summary>
              <div className="faq-content">
                <p>
                  Sim! Usamos criptografia de ponta a ponta e backup automático
                  na nuvem. Seus dados são privados e seguros, acessíveis apenas
                  por você.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <div className="help-footer">
        <div className="footer-content">
          <h3>Ainda precisa de ajuda?</h3>
          <p>
            Se você não encontrou a resposta que procura, entre em contato
            conosco.
          </p>
          <div className="contact-options">
            <a href="mailto:suporte@cifrasnew.com" className="btn btn-primary">
              <span className="icon">📧</span>
              Enviar Email
            </a>
            <a href="#" className="btn btn-secondary">
              <span className="icon">💬</span>
              Chat Online
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
