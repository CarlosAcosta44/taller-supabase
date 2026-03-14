// src/pages/Login.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { authService }   from '../services/authService'

export function Login() {
  const { signIn }  = useAuthContext()
  const navigate    = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas')
    } finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    try {
      await authService.signInWithProvider('google')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className='auth-wrapper'>
      <div className='auth-card'>
        <h1>Iniciar Sesión</h1>
        <p className='subtitle'>Ingresa a tu cuenta para continuar</p>
        {error && <div className='error-msg'>{error}</div>}

        {/* ── Botón Google ── */}
        <button onClick={handleGoogle}
          style={{ width:'100%', display:'flex', alignItems:'center',
            justifyContent:'center', gap:'0.75rem', padding:'0.65rem',
            border:'1.5px solid var(--border)', borderRadius:'var(--radius)',
            background:'white', color:'var(--text)', fontWeight:500,
            cursor:'pointer', marginBottom:'1rem', fontSize:'0.95rem' }}>
          <img src='https://www.google.com/favicon.ico' width={18} height={18} />
          Continuar con Google
        </button>

        {/* ── Separador ── */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem',
          marginBottom:'1rem' }}>
          <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
          <span style={{ fontSize:'0.8rem', color:'var(--text-3)' }}>o</span>
          <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <input type='email' placeholder='Email' value={email}
            onChange={e => setEmail(e.target.value)} required />
          <input type='password' placeholder='Contraseña' value={password}
            onChange={e => setPassword(e.target.value)} required />
          <button type='submit' disabled={loading} style={{ width:'100%' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p style={{ marginTop:'1rem', fontSize:'0.9rem', color:'#6b7280' }}>
          No tienes cuenta? <Link to='/register'>Registrate aqui</Link>
        </p>
        <p style={{ marginTop:'0.5rem', fontSize:'0.85rem', color:'#6b7280' }}>
          <Link to='/recuperar'>¿Olvidaste tu contraseña?</Link>
        </p>
      </div>
    </div>
  )
}