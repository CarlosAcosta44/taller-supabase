// src/components/UserAvatar.tsx
import { useRef } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useAuthContext } from '../context/AuthContext'

export function UserAvatar() {
  const { user }                    = useAuthContext()
  const { profile, uploading, uploadAvatar } = useProfile()
  const inputRef                    = useRef<HTMLInputElement>(null)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg','image/png','image/webp'].includes(file.type))
      return alert('Solo JPG, PNG o WebP')
    if (file.size > 2 * 1024 * 1024)
      return alert('Máximo 2 MB')
    await uploadAvatar(file)
  }

  return (
    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
      <div onClick={() => inputRef.current?.click()}
        style={{ width:36, height:36, borderRadius:'50%', overflow:'hidden',
          cursor:'pointer', border:'2px solid var(--primary)',
          background:'var(--bg)', display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:'1rem' }}>
        {profile?.avatar_url
          ? <img src={profile.avatar_url} alt='avatar'
              style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <span>👤</span>
        }
      </div>
      <span style={{ fontSize:'0.82rem', color:'var(--text-2)' }}>
        {uploading ? 'Subiendo...' : (profile?.nombre || user?.email)}
      </span>
      <input ref={inputRef} type='file' accept='image/*'
        onChange={handleChange} style={{ display:'none' }} />
    </div>
  )
}