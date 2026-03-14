// src/components/ListaPanel.tsx
import { useState }    from 'react'
import { useListas }   from '../hooks/useListas'
import { useAuthContext } from '../context/AuthContext'

export function ListaPanel() {
  const {  }                                          = useAuthContext()
  const { propias, compartidas, listaActiva,
          setListaActiva, crearLista, compartirLista,
          eliminarLista }                                 = useListas()

  const [nuevaLista,   setNuevaLista]   = useState('')
  const [emailCompartir, setEmailCompartir] = useState('')
  const [rolCompartir, setRolCompartir] = useState<'viewer'|'editor'>('editor')
  const [listaCompartiendo, setListaCompartiendo] = useState<string | null>(null)

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevaLista.trim()) return
    await crearLista(nuevaLista.trim())
    setNuevaLista('')
  }

  const handleCompartir = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!listaCompartiendo || !emailCompartir.trim()) return
    try {
      await compartirLista(listaCompartiendo, emailCompartir.trim(), rolCompartir)
      setEmailCompartir('')
      setListaCompartiendo(null)
      alert('Lista compartida exitosamente')
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div style={{ background:'white', border:'1px solid #e4eaf6',
      borderRadius:'12px', padding:'1.25rem', marginBottom:'1.5rem', marginTop:'1.5rem' }}>

      <h3 style={{ margin:'0 0 1rem', fontSize:'1rem' }}>📂 Mis Listas</h3>

      {/* Crear nueva lista */}
      <form onSubmit={handleCrear} style={{ display:'flex', gap:'0.5rem',
        marginBottom:'1rem' }}>
        <input placeholder='Nueva lista...' value={nuevaLista}
          onChange={e => setNuevaLista(e.target.value)}
          style={{ flex:1, marginBottom:0 }} />
        <button type='submit'>+ Crear</button>
      </form>

      {/* Listas propias */}
      <p style={{ fontSize:'0.8rem', color:'#94a3b8', marginBottom:'0.5rem' }}>
        PROPIAS
      </p>
      {propias.map(lista => (
        <div key={lista.id} style={{ display:'flex', alignItems:'center',
          gap:'0.5rem', padding:'0.5rem 0.75rem', borderRadius:'8px',
          marginBottom:'0.3rem', cursor:'pointer',
          background: listaActiva?.id === lista.id ? '#eef2ff' : 'transparent',
          border: listaActiva?.id === lista.id ? '1px solid #c7d2fe' : '1px solid transparent' }}
          onClick={() => setListaActiva(lista)}>
          <span style={{ flex:1, fontSize:'0.9rem' }}>📋 {lista.nombre}</span>
          <button onClick={e => { e.stopPropagation(); setListaCompartiendo(lista.id) }}
            style={{ fontSize:'0.75rem', padding:'0.2rem 0.5rem',
              background:'#eef2ff', color:'#4f6ef7', border:'none',
              borderRadius:'6px', cursor:'pointer' }}>
            Compartir
          </button>
          <button onClick={e => { e.stopPropagation()
            confirm('¿Eliminar lista?') && eliminarLista(lista.id) }}
            style={{ fontSize:'0.75rem', padding:'0.2rem 0.5rem',
              background:'#fff1f1', color:'#ef4444', border:'none',
              borderRadius:'6px', cursor:'pointer' }}>
            Eliminar
          </button>
        </div>
      ))}

      {/* Listas compartidas conmigo */}
      {compartidas.length > 0 && (
        <>
          <p style={{ fontSize:'0.8rem', color:'#94a3b8',
            margin:'1rem 0 0.5rem' }}>COMPARTIDAS CONMIGO</p>
          {compartidas.map((c: any) => (
            <div key={c.listas?.id} style={{ display:'flex', alignItems:'center',
              gap:'0.5rem', padding:'0.5rem 0.75rem', borderRadius:'8px',
              marginBottom:'0.3rem', cursor:'pointer',
              background: listaActiva?.id === c.listas?.id ? '#f0fdf4' : 'transparent',
              border: listaActiva?.id === c.listas?.id
                ? '1px solid #bbf7d0' : '1px solid transparent' }}
              onClick={() => setListaActiva(c.listas)}>
              <span style={{ flex:1, fontSize:'0.9rem' }}>
                👥 {c.listas?.nombre}
              </span>
              <span style={{ fontSize:'0.75rem', padding:'0.2rem 0.5rem',
                background: c.rol === 'editor' ? '#eef2ff' : '#f8faff',
                color: c.rol === 'editor' ? '#4f6ef7' : '#94a3b8',
                borderRadius:'6px' }}>
                {c.rol}
              </span>
            </div>
          ))}
        </>
      )}

      {/* Modal compartir */}
      {listaCompartiendo && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:50 }}>
          <div style={{ background:'white', borderRadius:'16px', padding:'2rem',
            width:'100%', maxWidth:'400px', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin:'0 0 1rem' }}>Compartir lista</h3>
            <form onSubmit={handleCompartir}>
              <input type='email' placeholder='Email del usuario'
                value={emailCompartir}
                onChange={e => setEmailCompartir(e.target.value)} required />
              <select value={rolCompartir}
                onChange={e => setRolCompartir(e.target.value as any)}
                style={{ marginBottom:'1rem' }}>
                <option value='editor'>Editor — puede agregar y editar</option>
                <option value='viewer'>Viewer — solo puede ver</option>
              </select>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                <button type='submit' style={{ flex:1 }}>Compartir</button>
                <button type='button' className='btn-ghost'
                  onClick={() => setListaCompartiendo(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}