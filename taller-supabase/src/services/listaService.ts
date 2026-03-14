// src/services/listaService.ts
import { supabase } from '../lib/supabaseClient'

export const listaService = {

  // Obtener listas propias + listas compartidas conmigo
  getMisListas: async (userId: string) => {
    const { data: propias } = await supabase
      .from('listas')
      .select('*, lista_permisos(*)')
      .eq('owner_id', userId)

    const { data: compartidas } = await supabase
      .from('lista_permisos')
      .select('rol, listas(*)')
      .eq('user_id', userId)

    return {
      propias:     propias ?? [],
      compartidas: compartidas ?? [],
    }
  },

  // Crear nueva lista
  crear: (nombre: string, userId: string) =>
    supabase.from('listas').insert({ nombre, owner_id: userId }).select().single(),

  // Eliminar lista
  eliminar: (listaId: string) =>
    supabase.from('listas').delete().eq('id', listaId),

  // Compartir lista con otro usuario por email
  compartir: async (listaId: string, email: string, rol: 'viewer' | 'editor') => {
    // Buscar usuario por email en profiles
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (error || !profile) throw new Error('Usuario no encontrado')

    return supabase.from('lista_permisos').insert({
      lista_id: listaId,
      user_id:  profile.id,
      rol,
    })
  },

  // Quitar permiso
  quitarPermiso: (listaId: string, userId: string) =>
    supabase.from('lista_permisos')
      .delete()
      .eq('lista_id', listaId)
      .eq('user_id', userId),

  // Cambiar rol
  cambiarRol: (listaId: string, userId: string, rol: 'viewer' | 'editor') =>
    supabase.from('lista_permisos')
      .update({ rol })
      .eq('lista_id', listaId)
      .eq('user_id', userId),

  // Obtener tareas de una lista
  getTareas: (listaId: string) =>
    supabase.from('tareas')
      .select('*')
      .eq('lista_id', listaId)
      .order('created_at', { ascending: false }),

  // Mover tarea a una lista
  moverTarea: (tareaId: string, listaId: string) =>
    supabase.from('tareas').update({ lista_id: listaId }).eq('id', tareaId),
}