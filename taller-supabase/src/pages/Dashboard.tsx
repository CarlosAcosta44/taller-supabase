// src/pages/Dashboard.tsx
import { useDashboard }   from '../hooks/useDashboard'
import { StatCard }       from '../components/Dashboard/StatCard'
import { TaskChart }      from '../components/Dashboard/TaskChart'
import { DonutChart }     from '../components/Dashboard/DonutChart'
import { ActivityFeed }   from '../components/Dashboard/ActivityFeed'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { DashboardPDF }    from '../components/Dashboard/DashboardPDF'

export function Dashboard() {
  const { stats, activity, distribution, recentFeed,
          loading, lastUpdated, refresh } = useDashboard()

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center',
      alignItems:'center', height:'60vh' }}>
      <p>⏳ Cargando dashboard...</p>
    </div>
  )

  return (
    <div style={{ padding:'2rem', maxWidth:'1200px', margin:'0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display:'flex', justifyContent:'space-between',
        alignItems:'center', marginBottom:'2rem' }}>
        <div>
          <h1 style={{ margin:0 }}>📊 Dashboard</h1>
          {lastUpdated && (
            <p style={{ margin:0, fontSize:'0.8rem', color:'#94a3b8' }}>
              Actualizado: {lastUpdated.toLocaleTimeString('es-CO')}
              {' · '}<span style={{ color:'#10b981' }}>● Realtime activo</span>
            </p>
          )}
        </div>
        <button onClick={refresh}
          style={{ padding:'0.5rem 1rem', borderRadius:'8px', cursor:'pointer',
            border:'1px solid #e2e8f0', background:'white', color:'black'}}>
          🔄 Actualizar
        </button>
        <PDFDownloadLink
          document={<DashboardPDF stats={stats} recentFeed={recentFeed} />}
          fileName={`reporte-tareas-${new Date().toLocaleDateString('es-CO')}.pdf`}>
          {({ loading }) => (
            <button className='btn-ghost'>
              {loading ? 'Generando...' : '📄 Exportar PDF'}
            </button>
          )}
        </PDFDownloadLink>
      </div>

      {/* ── Fila de KPIs ── */}
      {stats && (
        <div style={{ display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',
          gap:'1rem', marginBottom:'2rem' }}>
          <StatCard titulo='Total'       valor={stats.total}
            icono='📋' color='#1a56a0' subtitulo='Todas las tareas' />
          <StatCard titulo='Completadas' valor={stats.completadas}
            icono='✅' color='#10b981' subtitulo={`${stats.porcentaje}%`} />
          <StatCard titulo='Pendientes'  valor={stats.pendientes}
            icono='⏳' color='#f59e0b' subtitulo='Por completar' />
          <StatCard titulo='Progreso'    valor={`${stats.porcentaje}%`}
            icono='📈' color='#8b5cf6' subtitulo='Completitud' />
          <StatCard titulo='Hoy'         valor={stats.creadasHoy}
            icono='📅' color='#0f766e' subtitulo='Nuevas hoy' />
        </div>
      )}

      {/* ── Barra de progreso animada ── */}
      {stats && (
        <div style={{ background:'white', borderRadius:'12px',
          padding:'1.5rem', marginBottom:'2rem',
          boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display:'flex', justifyContent:'space-between',
            marginBottom:'0.5rem' }}>
            <span style={{ fontWeight:600 }}>Progreso global</span>
            <span style={{ fontWeight:800, color:'#10b981' }}>
              {stats.porcentaje}%
            </span>
          </div>
          <div style={{ background:'#e2e8f0', borderRadius:'999px',
            height:'12px', overflow:'hidden' }}>
            <div style={{ width:`${stats.porcentaje}%`, height:'100%',
              background:'linear-gradient(90deg,#10b981,#059669)',
              borderRadius:'999px',
              transition:'width 0.8s ease' // ← se anima al actualizarse
            }} />
          </div>
        </div>
      )}

      {/* ── Gráficas ── */}
      <div style={{ display:'grid', gridTemplateRows:'1fr 1fr',
        gap:'1.5rem', marginBottom:'2rem' }}>
        <TaskChart  data={activity} />
        <DonutChart data={distribution} />
      </div>

      {/* ── Feed de actividad ── */}
      <ActivityFeed tareas={recentFeed} />

    </div>
  )
}