// src/components/TaskItem.tsx
import { useState } from 'react'
import type { Tarea } from '../types/database'
import { TagSelector } from './TagSelector'

interface Props {
  tarea:        Tarea
  onActualizar: (id: string, cambios: { completada?: boolean; titulo?: string; descripcion?: string }) => Promise<void>
  onEliminar:   (id: string) => Promise<void>
}

export function TaskItem({ tarea, onActualizar, onEliminar }: Props) {
  const [eliminando,    setEliminando]    = useState(false)
  const [editando,      setEditando]      = useState(false)
  const [nuevoTitulo,   setNuevoTitulo]   = useState(tarea.titulo)
  const [nuevaDesc,     setNuevaDesc]     = useState(tarea.descripcion ?? '')

  const handleEliminar = async () => {
    if (!confirm('¿Eliminar esta tarea?')) return
    setEliminando(true)
    await onEliminar(tarea.id)
  }

  const handleGuardar = async () => {
    if (!nuevoTitulo.trim()) return
    await onActualizar(tarea.id, {
      titulo:     nuevoTitulo.trim(),
      descripcion: nuevaDesc.trim()
    })
    setEditando(false)
  }

  const handleCancelar = () => {
    setNuevoTitulo(tarea.titulo)
    setNuevaDesc(tarea.descripcion ?? '')
    setEditando(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleCancelar()
  }

  return (
    <div className={`task-item ${tarea.completada ? 'completed' : ''}`}
      style={{ opacity: eliminando ? 0.5 : 1, flexDirection:'column',
        alignItems:'stretch' }}>

      <div style={{ display:'flex', gap:'1rem', alignItems:'center' }}>
        <input type='checkbox' checked={tarea.completada ?? false}
        onChange={() => onActualizar(tarea.id, { completada: !tarea.completada })} />

        <div style={{ flex:1 }}>
          {editando ? (
            <>
              <input
                autoFocus
                value={nuevoTitulo}
                onChange={e => setNuevoTitulo(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ fontSize:'0.95rem', fontWeight:600,
                  padding:'0.2rem 0.4rem', width:'100%', marginBottom:'0.5rem' }}
              />
              <textarea
                value={nuevaDesc}
                onChange={e => setNuevaDesc(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Descripción (opcional)'
                style={{ fontSize:'0.85rem', padding:'0.2rem 0.4rem',
                  width:'100%', minHeight:'60px', marginBottom:0 }}
              />
            </>
          ) : (
            <>
              <p className='task-title'
                onClick={() => !tarea.completada && setEditando(true)}
                title={tarea.completada ? '' : 'Click para editar'}
                style={{ cursor: tarea.completada ? 'default' : 'pointer' }}>
                {tarea.titulo}
              </p>
              {tarea.descripcion && (
                <p className='task-desc'>{tarea.descripcion}</p>
              )}
            </>
          )}
          <TagSelector tareaId={tarea.id} />
        </div>

        <div style={{ display:'flex', gap:'0.4rem', alignItems:'center' }}>
          {editando ? (
            <>
              <button onClick={handleGuardar}
                style={{ fontSize:'0.8rem', padding:'0.3rem 0.7rem',
                  background:'var(--success)', color:'white',
                  border:'none', borderRadius:'6px', cursor:'pointer' }}>
                Guardar
              </button>
              <button onClick={handleCancelar}
                style={{ fontSize:'0.8rem', padding:'0.3rem 0.7rem',
                  background:'var(--border)', color:'var(--text-2)',
                  border:'none', borderRadius:'6px', cursor:'pointer' }}>
                Cancelar
              </button>
            </>
          ) : (
            <>
              {!tarea.completada && (
                <button onClick={() => setEditando(true)}
                  style={{ fontSize:'0.8rem', padding:'0.3rem 0.7rem',
                    background:'#eef2ff', color:'var(--primary)',
                    border:'none', borderRadius:'6px', cursor:'pointer' }}>
                  ✏️ Editar
                </button>
              )}
              <button className='btn-danger' onClick={handleEliminar}
                disabled={eliminando}>
                🗑 Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}