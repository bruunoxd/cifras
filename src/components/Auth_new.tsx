import { useEffect, useState } from 'react'
import { supabase, isOfflineModeActive } from '../store/supabase'
import { Session, User } from '@supabase/supabase-js'

export default function Auth() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Se estiver no modo offline, simular usuário logado
    if (isOfflineModeActive) {
      const mockUser = {
        id: 'offline-user',
        email: 'usuario@offline.local',
      } as User

      const mockSession = {
        access_token: 'offline-token',
        refresh_token: 'offline-refresh',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: mockUser
      } as Session

      setSession(mockSession)
      setUser(mockUser)
      setLoading(false)
      return
    }

    if (!supabase) {
      setLoading(false)
      return
    }

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAuth = async () => {
    if (isOfflineModeActive) {
      setMessage('Modo offline - acesso automático concedido!')
      return
    }

    if (!supabase) {
      setError('Supabase não configurado')
      return
    }

    try {
      setError('')
      setMessage('')
      
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        setMessage('Login realizado com sucesso!')
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('Conta criada! Verifique seu email.')
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleSignOut = async () => {
    if (isOfflineModeActive) {
      setSession(null)
      setUser(null)
      setMessage('Saiu do modo offline')
      return
    }

    if (!supabase) return

    const { error } = await supabase.auth.signOut()
    if (error) {
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <div className="auth-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (session && user) {
    return (
      <div className="auth-container">
        <div className="user-info">
          <div className="user-avatar">
            👤
          </div>
          <div className="user-details">
            <h3>Bem-vindo!</h3>
            <p>{user.email}</p>
            {isOfflineModeActive && (
              <span className="offline-badge">🔌 Modo Offline</span>
            )}
          </div>
          <button onClick={handleSignOut} className="btn-secondary">
            Sair
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="auth-header">
          <h2>{isLogin ? 'Entrar' : 'Criar Conta'}</h2>
          {isOfflineModeActive && (
            <div className="offline-notice">
              <span className="offline-icon">🔌</span>
              <p>Modo offline ativo - dados salvos localmente</p>
            </div>
          )}
        </div>

        {!isOfflineModeActive && (
          <>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button onClick={handleAuth} className="btn-primary auth-btn">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </button>

            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="btn-text"
            >
              {isLogin ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
            </button>
          </>
        )}

        {isOfflineModeActive && (
          <button onClick={handleAuth} className="btn-primary auth-btn">
            🔌 Continuar no Modo Offline
          </button>
        )}

        {message && (
          <div className="message success">
            {message}
          </div>
        )}

        {error && (
          <div className="message error">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
