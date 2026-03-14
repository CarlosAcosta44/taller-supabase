// src/pages/NuevaPassword.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export function NuevaPassword() {
  const navigate            = useNavigate()
  const [password,  setPassword]  = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmar)
      return setError('Las contraseñas no coinciden')
    if (password.length < 6)
      return setError('Mínimo 6 caracteres')

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      navigate('/login')
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña')
    } finally { setLoading(false) }
  }

  return (
    <div className='auth-wrapper'>
      <div className='auth-card'>
        <h1>Nueva Contraseña</h1>
        <p className='subtitle'>Ingresa tu nueva contraseña</p>
        {error && <div className='error-msg'>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type='password' placeholder='Nueva contraseña'
            value={password}
            onChange={e => setPassword(e.target.value)} required />
          <input type='password' placeholder='Confirmar contraseña'
            value={confirmar}
            onChange={e => setConfirmar(e.target.value)} required />
          <button type='submit' disabled={loading} style={{ width:'100%' }}>
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}