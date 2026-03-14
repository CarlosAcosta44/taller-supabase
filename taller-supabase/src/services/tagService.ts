// src/services/tagService.ts
import { supabase } from '../lib/supabaseClient'

export const tagService = {

  // Obtener todos los tags disponibles
  getAll: () =>
    supabase.from('tags').select('*').order('nombre'),

  // Obtener tags de una tarea específica
  getByTarea: (tareaId: string) =>
    supabase
      .from('tarea_tags')
      .select('tag_id, tags(*)')
      .eq('tarea_id', tareaId),

  // Agregar tag a una tarea
  agregar: (tareaId: string, tagId: string) =>
    supabase.from('tarea_tags').insert({ tarea_id: tareaId, tag_id: tagId }),

  // Quitar tag de una tarea
  quitar: (tareaId: string, tagId: string) =>
    supabase.from('tarea_tags')
      .delete()
      .eq('tarea_id', tareaId)
      .eq('tag_id', tagId),
}