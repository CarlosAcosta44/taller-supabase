// src/hooks/useProfile.ts
import { useState, useEffect } from 'react'
import { profileService }      from '../services/profileService'
import { useAuthContext }      from '../context/AuthContext'

export function useProfile() {
  const { user }                    = useAuthContext()
  const [profile,    setProfile]    = useState<any>(null)
  const [uploading,  setUploading]  = useState(false)

  useEffect(() => {
    if (!user) return
    profileService.getProfile(user.id).then(({ data }) => setProfile(data))
  }, [user])

  const uploadAvatar = async (file: File) => {
    if (!user) return
    setUploading(true)
    try {
      const url = await profileService.uploadAvatar(user.id, file)
      await profileService.updateProfile(user.id, { avatar_url: url })
      setProfile((prev: any) => ({ ...prev, avatar_url: url }))
    } finally { setUploading(false) }
  }

  return { profile, uploading, uploadAvatar }
}