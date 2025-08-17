import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";
import "./app.css";

export default function App() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { prefs } = useTheme(); // Hook para tema global

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fechar menu ao mudar de rota
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Fechar menu com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // Prevenir scroll
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const menuItems = [
    {
      path: "/musicas",
      label: "Minhas músicas",
      icon: "🎵",
      description: "Gerencie suas cifras",
    },
    {
      path: "/favoritos",
      label: "Favoritos",
      icon: "❤️",
      description: "Suas músicas preferidas",
    },
    {
      path: "/historico",
      label: "Histórico",
      icon: "🕒",
      description: "Músicas recentes",
    },
    {
      path: "/offline",
      label: "Offline",
      icon: "📱",
      description: "Acesso sem internet",
    },
    {
      path: "/listas",
      label: "Minhas listas",
      icon: "📋",
      description: "Organize por categorias",
    },
    {
      path: "/buscar",
      label: "Procurar música",
      icon: "🔍",
      description: "Encontre novas cifras",
    },
    {
      path: "/importar",
      label: "Importar .txt",
      icon: "📄",
      description: "Importe seus arquivos",
    },
    {
      path: "/backup",
      label: "Backup & Restauração",
      icon: "💾",
      description: "Proteja seus dados",
    },
    {
      path: "/login",
      label: "Login / Conta",
      icon: "👤",
      description: "Gerencie sua conta",
    },
    {
      path: "/preferencias",
      label: "Preferências",
      icon: "⚙️",
      description: "Personalize o app",
    },
    {
      path: "/sociais",
      label: "Redes sociais",
      icon: "🌐",
      description: "Conecte-se",
    },
    {
      path: "/ajuda",
      label: "Ajuda",
      icon: "❓",
      description: "Suporte e tutoriais",
    },
    {
      path: "/sobre",
      label: "Sobre",
      icon: "ℹ️",
      description: "Informações do app",
    },
    {
      path: "/assinatura",
      label: "Comprar assinatura",
      icon: "👑",
      description: "Recursos premium",
    },
  ];

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => mounted && setMenuOpen(false);

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find((item) => item.path === pathname);
    return currentItem?.label || "CifrasNew";
  };

  return (
    <div
      className={`app ${mounted ? "mounted" : ""} ${
        menuOpen ? "sidebar-open" : ""
      }`}
    >
      {/* Overlay for mobile */}
      {menuOpen && <div className="overlay" onClick={closeMenu}></div>}

      {/* Header with hamburger */}
      <header className="header">
        <button className="hamburger" onClick={toggleMenu} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="header-title">{getCurrentPageTitle()}</h1>
        <div className="header-actions">
          {/* Status removido temporariamente */}
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div>
            <h2>🎸 CifrasNew</h2>
            <p className="sidebar-subtitle">Seu app de cifras</p>
          </div>
          <button
            className="close-btn"
            onClick={closeMenu}
            aria-label="Fechar menu"
          >
            ×
          </button>
        </div>

        <nav className="nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${
                pathname === item.path ||
                (item.path === "/musicas" && pathname === "/")
                  ? "active"
                  : ""
              }`}
              onClick={closeMenu}
            >
              <span className="nav-icon">{item.icon}</span>
              <div className="nav-content">
                <span className="nav-label">{item.label}</span>
                <span className="nav-description">{item.description}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="app-version">
            <small>v1.0.0 - Feito com ❤️</small>
          </div>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="main-content">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
