// src/hooks/useTags.ts
import { useState, useEffect } from 'react'
import { tagService }          from '../services/tagService'
import type { Tag }            from '../types/database'

export function useTags(tareaId: string) {
  const [todosLosTags, setTodosLosTags] = useState<Tag[]>([])
  const [tagsActivos,  setTagsActivos]  = useState<Tag[]>([])

  useEffect(() => {
    // Cargar todos los tags disponibles
    tagService.getAll().then(({ data }) => setTodosLosTags(data ?? []))

    // Cargar tags de esta tarea
    tagService.getByTarea(tareaId).then(({ data }) => {
      const tags = data?.map((d: any) => d.tags).filter(Boolean) ?? []
      setTagsActivos(tags)
    })
  }, [tareaId])

  const toggleTag = async (tag: Tag) => {
    const activo = tagsActivos.some(t => t.id === tag.id)
    if (activo) {
      await tagService.quitar(tareaId, tag.id)
      setTagsActivos(prev => prev.filter(t => t.id !== tag.id))
    } else {
      await tagService.agregar(tareaId, tag.id)
      setTagsActivos(prev => [...prev, tag])
    }
  }

  return { todosLosTags, tagsActivos, toggleTag }
}