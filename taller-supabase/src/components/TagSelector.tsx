// src/components/TagSelector.tsx
import { useState } from 'react'
import { useTags }  from '../hooks/useTags'
import type { Tag } from '../types/database'

export function TagSelector({ tareaId }: { tareaId: string }) {
  const { todosLosTags, tagsActivos, toggleTag } = useTags(tareaId)
  const [abierto, setAbierto] = useState(false)

  const getColor = (tag: Tag) => tag.color ?? '#6366f1'

  return (
    <div style={{ position:'relative' }}>

      {/* Tags activos */}
      <div style={{ display:'flex', gap:'0.3rem', flexWrap:'wrap',
        alignItems:'center' }}>
        {tagsActivos.map(tag => (
          <span key={tag.id} style={{
            background: getColor(tag) + '22',
            color: getColor(tag),
            border: `1px solid ${getColor(tag)}55`,
            borderRadius:'999px', padding:'0.1rem 0.5rem',
            fontSize:'0.72rem', fontWeight:600 }}>
            {tag.nombre}
          </span>
        ))}
        <button onClick={() => setAbierto(!abierto)}
          style={{ fontSize:'0.75rem', padding:'0.1rem 0.5rem',
            borderRadius:'999px', border:'1px dashed #94a3b8',
            background:'transparent', color:'#94a3b8', cursor:'pointer' }}>
          + tag
        </button>
      </div>

      {/* Dropdown de tags */}
      {abierto && (
        <div style={{ position:'absolute', top:'100%', left:0, zIndex:10,
          background:'white', border:'1px solid #e2e8f0', borderRadius:'10px',
          padding:'0.5rem', boxShadow:'0 4px 16px rgba(0,0,0,0.1)',
          display:'flex', flexWrap:'wrap', gap:'0.4rem', minWidth:'200px',
          marginTop:'0.3rem' }}>
          {todosLosTags.map(tag => {
            const activo = tagsActivos.some(t => t.id === tag.id)
            const color  = getColor(tag)
            return (
              <span key={tag.id} onClick={() => toggleTag(tag)}
                style={{
                  background: activo ? color : color + '22',
                  color: activo ? 'white' : color,
                  border: `1px solid ${color}55`,
                  borderRadius:'999px', padding:'0.2rem 0.6rem',
                  fontSize:'0.78rem', fontWeight:600, cursor:'pointer',
                  transition:'all 0.15s ease' }}>
                {activo ? '✓ ' : ''}{tag.nombre}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}