import "./Sobre.css";

export default function Sobre() {
  const appVersion = "1.0.0";
  const buildDate = new Date().toLocaleDateString("pt-BR");

  const features = [
    {
      icon: "🎵",
      title: "Biblioteca Pessoal",
      description: "Organize suas cifras favoritas em uma biblioteca pessoal",
    },
    {
      icon: "📱",
      title: "Multiplataforma",
      description:
        "Funciona em todos os dispositivos - mobile, tablet e desktop",
    },
    {
      icon: "☁️",
      title: "Sincronização",
      description: "Dados sincronizados na nuvem entre todos seus dispositivos",
    },
    {
      icon: "🔍",
      title: "Busca Avançada",
      description: "Encontre músicas por título, artista, letra ou acordes",
    },
    {
      icon: "📋",
      title: "Playlists",
      description: "Crie listas personalizadas para diferentes ocasiões",
    },
    {
      icon: "💾",
      title: "Backup Seguro",
      description: "Backup automático e exportação de dados",
    },
  ];

  const team = [
    {
      name: "Bruno Silva",
      role: "Desenvolvedor Principal",
      avatar: "👨‍💻",
      description: "Responsável pelo desenvolvimento e design do aplicativo",
    },
  ];

  const technologies = [
    { name: "React", icon: "⚛️", description: "Framework JavaScript" },
    { name: "TypeScript", icon: "📘", description: "Linguagem tipada" },
    { name: "Vite", icon: "⚡", description: "Build tool moderna" },
    { name: "Supabase", icon: "🔥", description: "Backend e database" },
    { name: "Capacitor", icon: "📱", description: "App nativo" },
    { name: "CSS3", icon: "🎨", description: "Estilização moderna" },
  ];

  const stats = [
    { label: "Linhas de Código", value: "10,000+", icon: "💻" },
    { label: "Commits", value: "500+", icon: "🔄" },
    { label: "Horas de Desenvolvimento", value: "200+", icon: "⏱️" },
    { label: "Testes Realizados", value: "100+", icon: "🧪" },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="icon">ℹ️</span>
            Sobre o CifrasNew
          </h1>
          <p className="page-subtitle">
            Conheça mais sobre seu app de cifras favorito
          </p>
        </div>
      </div>

      <div className="about-grid">
        {/* Apresentação Principal */}
        <div className="about-section hero-section">
          <div className="app-showcase">
            <div className="app-icon">🎵</div>
            <div className="app-info">
              <h2>CifrasNew</h2>
              <p className="app-tagline">
                O aplicativo definitivo para organizar e tocar suas cifras
                musicais
              </p>
              <div className="app-stats">
                <div className="stat-item">
                  <span className="stat-label">Versão:</span>
                  <span className="stat-value">{appVersion}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Última atualização:</span>
                  <span className="stat-value">{buildDate}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Plataforma:</span>
                  <span className="stat-value">Web & Mobile</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recursos Principais */}
        <div className="about-section">
          <div className="section-header">
            <span className="section-icon">✨</span>
            <h2>Principais Recursos</h2>
          </div>

          <div className="features-showcase">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tecnologias */}
        <div className="about-section">
          <div className="section-header">
            <span className="section-icon">🛠️</span>
            <h2>Tecnologias Utilizadas</h2>
          </div>

          <div className="tech-grid">
            {technologies.map((tech, index) => (
              <div key={index} className="tech-card">
                <div className="tech-icon">{tech.icon}</div>
                <h4>{tech.name}</h4>
                <p>{tech.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Equipe */}
        <div className="about-section">
          <div className="section-header">
            <span className="section-icon">👥</span>
            <h2>Equipe de Desenvolvimento</h2>
          </div>

          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-avatar">{member.avatar}</div>
                <div className="member-info">
                  <h4>{member.name}</h4>
                  <p className="member-role">{member.role}</p>
                  <p className="member-description">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estatísticas de Desenvolvimento */}
        <div className="about-section">
          <div className="section-header">
            <span className="section-icon">📊</span>
            <h2>Estatísticas do Projeto</h2>
          </div>

          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Missão e Visão */}
        <div className="about-section">
          <div className="section-header">
            <span className="section-icon">🎯</span>
            <h2>Missão e Visão</h2>
          </div>

          <div className="mission-vision">
            <div className="mission-card">
              <div className="card-icon">🎯</div>
              <h3>Nossa Missão</h3>
              <p>
                Democratizar o acesso à música, fornecendo uma ferramenta
                simples e poderosa para músicos de todos os níveis organizarem e
                compartilharem suas cifras.
              </p>
            </div>

            <div className="vision-card">
              <div className="card-icon">🔮</div>
              <h3>Nossa Visão</h3>
              <p>
                Ser a plataforma de referência mundial para organização de
                cifras musicais, conectando músicos e facilitando o aprendizado
                musical.
              </p>
            </div>
          </div>
        </div>

        {/* Agradecimentos */}
        <div className="about-section">
          <div className="section-header">
            <span className="section-icon">🙏</span>
            <h2>Agradecimentos</h2>
          </div>

          <div className="thanks-content">
            <p>
              Agradecemos a todos os músicos e usuários que contribuem para
              tornar o CifrasNew cada vez melhor. Suas sugestões, feedback e
              apoio são fundamentais para nossa evolução.
            </p>

            <div className="special-thanks">
              <h4>Agradecimentos especiais:</h4>
              <ul>
                <li>
                  🎸 <strong>Comunidade musical brasileira</strong> - Pela
                  inspiração e feedback constante
                </li>
                <li>
                  🎵 <strong>Contribuidores de cifras</strong> - Por
                  compartilharem seu conhecimento
                </li>
                <li>
                  💻 <strong>Desenvolvedores open source</strong> - Pelas
                  ferramentas incríveis
                </li>
                <li>
                  🎤 <strong>Beta testers</strong> - Por testarem e reportarem
                  bugs
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contato e Suporte */}
        <div className="about-section contact-section">
          <div className="section-header">
            <span className="section-icon">📞</span>
            <h2>Contato e Suporte</h2>
          </div>

          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h4>Email</h4>
              <p>suporte@cifrasnew.com</p>
              <a
                href="mailto:suporte@cifrasnew.com"
                className="btn btn-secondary"
              >
                Enviar Email
              </a>
            </div>

            <div className="contact-card">
              <div className="contact-icon">🐛</div>
              <h4>Reportar Bug</h4>
              <p>Encontrou um problema? Nos ajude a corrigi-lo!</p>
              <button className="btn btn-secondary">Reportar Problema</button>
            </div>

            <div className="contact-card">
              <div className="contact-icon">💡</div>
              <h4>Sugestões</h4>
              <p>Tem uma ideia para melhorar o app?</p>
              <button className="btn btn-secondary">Enviar Sugestão</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="about-footer">
        <div className="footer-content">
          <p>
            Feito com ❤️ para a comunidade musical • © 2025 CifrasNew • Todos os
            direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
