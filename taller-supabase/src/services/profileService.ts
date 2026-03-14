// src/services/profileService.ts
import { supabase } from '../lib/supabaseClient'

export const profileService = {

  getProfile: (userId: string) =>
    supabase.from('profiles').select('*').eq('id', userId).single(),

  updateProfile: (userId: string, data: { nombre?: string; avatar_url?: string }) =>
    supabase.from('profiles').update(data).eq('id', userId),

  uploadAvatar: async (userId: string, file: File) => {
    const ext  = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`
    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    return data.publicUrl
  },
}