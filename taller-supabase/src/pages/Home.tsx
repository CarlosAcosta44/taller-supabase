// src/pages/Home.tsx
import { Link }               from 'react-router-dom'
import { useState }           from 'react'
import { useRealtimeTasks }   from '../hooks/useRealtimeTasks'
import { usePresence }        from '../hooks/usePresence'
import { useAuthContext }     from '../context/AuthContext'
import { TaskForm }           from '../components/TaskForm'
import { TaskItem }           from '../components/TaskItem'
import { RealtimeIndicator }  from '../components/RealtimeIndicator'
import { UserAvatar }         from '../components/UserAvatar'  
import { ListaPanel } from '../components/ListaPanel'

type Filtro = 'todas' | 'pendientes' | 'completadas'

const TAREAS_POR_PAGINA = 10

export function Home() {
  const { tareas, loading, conectado, crearTarea, actualizarTarea, eliminarTarea } =
    useRealtimeTasks()
  const { onlineUsers } = usePresence('home-sala')
  const { signOut }     = useAuthContext()
  const [busqueda, setBusqueda] = useState('')

  const [filtro,   setFiltro]   = useState<Filtro>('todas')
  const [pagina,   setPagina]   = useState(1)

  const tareasFiltradas = tareas.filter(t => {
    const coincideFiltro =
      filtro === 'pendientes'  ? !t.completada :
      filtro === 'completadas' ?  t.completada : true

    const coincideBusqueda =
      t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (t.descripcion ?? '').toLowerCase().includes(busqueda.toLowerCase())

    return coincideFiltro && coincideBusqueda
  })

  const totalPaginas   = Math.ceil(tareasFiltradas.length / TAREAS_POR_PAGINA)
  const inicio         = (pagina - 1) * TAREAS_POR_PAGINA
  const tareasPagina   = tareasFiltradas.slice(inicio, inicio + TAREAS_POR_PAGINA)

  // Si cambia el filtro volver a página 1
  const handleFiltro = (f: Filtro) => {
    setFiltro(f)
    setPagina(1)
  }

  if (loading) return <div className='loading-screen'><div className='spinner'/></div>

  return (
    <div className='content-task'>

      <nav style={{ display:'flex', justifyContent:'space-between' }}>
        <div style={{ display:'flex', gap:'1rem' }}>
          <Link to='/'>📋 Mis Tareas</Link>
          <Link to='/dashboard'>📊 Dashboard</Link>
        </div>
        <div style={{ display:'flex', gap:'1rem', alignItems:'center' }}>
          <RealtimeIndicator conectado={conectado} />
          <span style={{ fontSize:'0.85rem', color:'#64748b' }}>
            👥 {onlineUsers.length} en linea
          </span>
          <UserAvatar />
          <button onClick={signOut}>Salir</button>
        </div>
      </nav>

      <h1>📋 Mis Tareas</h1>

      <ListaPanel />

      <TaskForm
        onCrear={async (titulo, descripcion) => {
          await crearTarea({ titulo, descripcion })
          setPagina(1)  // al crear una tarea volver a página 1
        }}
      />

      <div style={{ position:'relative', marginBottom:'1rem' }}>
        <span style={{ position:'absolute', left:'0.75rem', top:'50%',
          transform:'translateY(-50%)', color:'#94a3b8', fontSize:'1rem' }}>
          🔍
        </span>
        <input
          type='text'
          placeholder='Buscar tareas...'
          value={busqueda}
          onChange={e => { setBusqueda(e.target.value); setPagina(1) }}
          style={{ paddingLeft:'2.2rem', marginBottom:0 }}
        />
      </div>

      {/* ── Filtros ── */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1rem' }}>
        {(['todas', 'pendientes', 'completadas'] as Filtro[]).map(f => (
          <button key={f} onClick={() => handleFiltro(f)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              border: '1.5px solid',
              borderColor: filtro === f ? 'var(--primary)' : 'var(--border)',
              background:   filtro === f ? 'var(--primary)' : 'white',
              color:        filtro === f ? 'white' : 'var(--text-2)',
              fontWeight:   filtro === f ? 600 : 400,
              cursor: 'pointer',
              fontSize: '0.85rem',
              textTransform: 'capitalize'
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* ── Lista de tareas ── */}
      {tareasPagina.length === 0
        ? <p style={{ color:'#94a3b8' }}>
            {filtro === 'todas' ? 'No tienes tareas aún. ¡Crea una!' : `No hay tareas ${filtro}`}
          </p>
        : tareasPagina.map(t => (
            <TaskItem key={t.id} tarea={t}
              onActualizar={async (id, cambios) => { await actualizarTarea(id, cambios) }}
              onEliminar={eliminarTarea}
            />
          ))
      }

      {/* ── Paginación ── */}
      {totalPaginas > 1 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
          gap:'1rem', marginTop:'1.5rem' }}>
          <button onClick={() => setPagina(p => p - 1)} disabled={pagina === 1}
            className='btn-ghost'>
            ← Anterior
          </button>
          <span style={{ fontSize:'0.9rem', color:'var(--text-2)' }}>
            Página {pagina} de {totalPaginas}
          </span>
          <button onClick={() => setPagina(p => p + 1)} disabled={pagina === totalPaginas}
            className='btn-ghost'>
            Siguiente →
          </button>
        </div>
      )}

      <p style={{ color:'#94a3b8', fontSize:'0.9rem', marginTop:'1rem' }}>
        {tareas.filter(t => t.completada).length} / {tareas.length} completadas
      </p>

    </div>
  )
}