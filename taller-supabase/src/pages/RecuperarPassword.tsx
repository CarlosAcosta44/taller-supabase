// src/pages/RecuperarPassword.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export function RecuperarPassword() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/nueva-password`
      })
      if (error) throw error
      setEnviado(true)
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo')
    } finally { setLoading(false) }
  }

  if (enviado) return (
    <div className='auth-wrapper'>
      <div className='auth-card' style={{ textAlign:'center' }}>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📧</div>
        <h1 style={{ fontSize:'1.5rem' }}>Revisa tu correo</h1>
        <p className='subtitle'>
          Enviamos un enlace a <strong>{email}</strong> para restablecer
          tu contraseña.
        </p>
        <Link to='/login'>
          <button style={{ width:'100%', marginTop:'1rem' }}>
            Volver al login
          </button>
        </Link>
      </div>
    </div>
  )

  return (
    <div className='auth-wrapper'>
      <div className='auth-card'>
        <h1>Recuperar Contraseña</h1>
        <p className='subtitle'>
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
        </p>
        {error && <div className='error-msg'>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type='email' placeholder='Email' value={email}
            onChange={e => setEmail(e.target.value)} required />
          <button type='submit' disabled={loading} style={{ width:'100%' }}>
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
        <p style={{ marginTop:'1rem', fontSize:'0.9rem', color:'#6b7280' }}>
          ¿Recordaste tu contraseña? <Link to='/login'>Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}