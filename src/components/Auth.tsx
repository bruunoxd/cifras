import { useEffect, useState } from "react";
import { supabase, isOfflineModeActive } from "../store/supabase";
import { Session, User } from "@supabase/supabase-js";
import "./Auth.css";

export default function Auth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Se estiver no modo offline, simular usuário logado
    if (isOfflineModeActive) {
      const mockUser = {
        id: "offline-user",
        email: "usuario@offline.local",
      } as User;

      const mockSession = {
        access_token: "offline-token",
        refresh_token: "offline-refresh",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: "bearer",
        user: mockUser,
      } as Session;

      setSession(mockSession);
      setUser(mockUser);
      setLoading(false);
      return;
    }

    if (!supabase) {
      setLoading(false);
      return;
    }

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async () => {
    if (isOfflineModeActive) {
      setMessage("Modo offline - acesso automático concedido!");
      return;
    }

    if (!supabase) {
      setError("Supabase não configurado");
      return;
    }

    try {
      setError("");
      setMessage("");
      setIsLoading(true);

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Login realizado com sucesso!");
      } else {
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem");
        }
        if (password.length < 6) {
          throw new Error("A senha deve ter pelo menos 6 caracteres");
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            },
          },
        });
        if (error) throw error;
        setMessage("Conta criada! Verifique seu email para confirmar.");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (
    provider: "google" | "apple" | "facebook"
  ) => {
    if (isOfflineModeActive) {
      setMessage("Login social não disponível no modo offline");
      return;
    }

    if (!supabase) {
      setError("Supabase não configurado");
      return;
    }

    try {
      setError("");
      setMessage("");
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      setMessage(`Redirecionando para ${provider}...`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (isOfflineModeActive) {
      setSession(null);
      setUser(null);
      setMessage("Saiu do modo offline");
      return;
    }

    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Digite seu email primeiro");
      return;
    }

    if (!supabase) {
      setError("Supabase não configurado");
      return;
    }

    try {
      setError("");
      setMessage("");
      setIsLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setMessage("Email de recuperação enviado!");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (session && user) {
    return (
      <div className="auth-container">
        <div className="user-profile">
          <div className="profile-card">
            <div className="profile-header">
              <div className="user-avatar">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" />
                ) : (
                  <span className="avatar-fallback">
                    {user.user_metadata?.name?.charAt(0) ||
                      user.email?.charAt(0) ||
                      "👤"}
                  </span>
                )}
              </div>
              <div className="user-info">
                <h3>Bem-vindo de volta!</h3>
                <p className="user-name">
                  {user.user_metadata?.name || user.email}
                </p>
                <p className="user-email">{user.email}</p>
                {isOfflineModeActive && (
                  <span className="offline-badge">
                    <span className="badge-icon">🔌</span>
                    Modo Offline
                  </span>
                )}
              </div>
            </div>

            <div className="profile-actions">
              <button
                onClick={handleSignOut}
                className="btn btn-secondary logout-btn"
              >
                <span className="btn-icon">🚪</span>
                Sair da Conta
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">
            {isLogin ? "Entrar na sua conta" : "Criar nova conta"}
          </h2>
          <p className="auth-description">
            {isLogin
              ? "Entre com sua conta para sincronizar suas cifras"
              : "Crie sua conta e tenha suas cifras em todos os dispositivos"}
          </p>

          {isOfflineModeActive && (
            <div className="offline-notice">
              <span className="offline-icon">🔌</span>
              <p>Modo offline ativo - dados salvos localmente</p>
            </div>
          )}
        </div>

        {!isOfflineModeActive && (
          <>
            {/* Social Login */}
            <div className="social-login">
              <p className="social-title">Entre com suas redes sociais</p>
              <div className="social-buttons">
                <button
                  onClick={() => handleSocialLogin("google")}
                  className="btn social-btn google-btn"
                  disabled={isLoading}
                >
                  <span className="social-icon">🔍</span>
                  <span>Google</span>
                </button>

                <button
                  onClick={() => handleSocialLogin("apple")}
                  className="btn social-btn apple-btn"
                  disabled={isLoading}
                >
                  <span className="social-icon">🍎</span>
                  <span>Apple</span>
                </button>

                <button
                  onClick={() => handleSocialLogin("facebook")}
                  className="btn social-btn facebook-btn"
                  disabled={isLoading}
                >
                  <span className="social-icon">📘</span>
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            <div className="divider">
              <span className="divider-text">ou</span>
            </div>

            {/* Email/Password Form */}
            <form
              className="auth-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleAuth();
              }}
            >
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Nome completo</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Senha</label>
                <div className="password-input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Confirmar senha</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="btn-spinner"></span>
                    {isLogin ? "Entrando..." : "Criando conta..."}
                  </>
                ) : (
                  <>
                    <span className="btn-icon">{isLogin ? "🔑" : "✨"}</span>
                    {isLogin ? "Entrar" : "Criar Conta"}
                  </>
                )}
              </button>

              {isLogin && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="btn btn-text forgot-btn"
                  disabled={isLoading}
                >
                  Esqueci minha senha
                </button>
              )}
            </form>
          </>
        )}

        {isOfflineModeActive && (
          <button onClick={handleAuth} className="btn btn-primary offline-btn">
            <span className="btn-icon">🔌</span>
            Continuar no Modo Offline
          </button>
        )}

        {/* Toggle between login/signup */}
        {!isOfflineModeActive && (
          <div className="auth-toggle">
            <p>{isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}</p>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setMessage("");
                setPassword("");
                setConfirmPassword("");
                setName("");
              }}
              className="btn btn-text toggle-btn"
            >
              {isLogin ? "Criar conta gratuita" : "Fazer login"}
            </button>
          </div>
        )}

        {/* Messages */}
        {message && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            {message}
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
