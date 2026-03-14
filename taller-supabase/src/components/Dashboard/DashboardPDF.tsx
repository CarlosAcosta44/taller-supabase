// src/components/Dashboard/DashboardPDF.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page:        { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#f8faff' },
  title:       { fontSize: 24, fontWeight: 'bold', marginBottom: 4, color: '#111827' },
  subtitle:    { fontSize: 11, color: '#6b7280', marginBottom: 24 },
  section:     { marginBottom: 20 },
  sectionTitle:{ fontSize: 13, fontWeight: 'bold', color: '#4f6ef7',
                 marginBottom: 10, paddingBottom: 4,
                 borderBottom: '1px solid #e4eaf6' },
  kpiRow:      { flexDirection: 'row', gap: 12, marginBottom: 12 },
  kpiCard:     { flex: 1, padding: 12, borderRadius: 8,
                 backgroundColor: '#ffffff', border: '1px solid #e4eaf6' },
  kpiLabel:    { fontSize: 9, color: '#6b7280', marginBottom: 4 },
  kpiValue:    { fontSize: 22, fontWeight: 'bold' },
  row:         { flexDirection: 'row', justifyContent: 'space-between',
                 padding: '6 8', borderRadius: 4, marginBottom: 4 },
  rowEven:     { backgroundColor: '#f0f4ff' },
  rowText:     { fontSize: 10, color: '#374151' },
  rowStatus:   { fontSize: 9, fontWeight: 'bold' },
  progressBg:  { backgroundColor: '#e4eaf6', borderRadius: 4,
                 height: 10, marginTop: 6 },
  progressFill:{ height: 10, borderRadius: 4, backgroundColor: '#4f6ef7' },
  footer:      { position: 'absolute', bottom: 30, left: 40, right: 40,
                 flexDirection: 'row', justifyContent: 'space-between' },
  footerText:  { fontSize: 9, color: '#9ca3af' },
})

interface Props {
  stats:      any
  recentFeed: any[]
}

export function DashboardPDF({ stats, recentFeed }: Props) {
  const fecha = new Date().toLocaleDateString('es-CO', {
    day: '2-digit', month: 'long', year: 'numeric'
  })

  return (
    <Document>
      <Page size='A4' style={styles.page}>

        {/* Header */}
        <Text style={styles.title}>Reporte de Tareas</Text>
        <Text style={styles.subtitle}>Generado el {fecha}</Text>

        {/* KPIs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen General</Text>
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Total</Text>
              <Text style={[styles.kpiValue, { color: '#1a56a0' }]}>{stats?.total ?? 0}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Completadas</Text>
              <Text style={[styles.kpiValue, { color: '#10b981' }]}>{stats?.completadas ?? 0}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Pendientes</Text>
              <Text style={[styles.kpiValue, { color: '#f59e0b' }]}>{stats?.pendientes ?? 0}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Progreso</Text>
              <Text style={[styles.kpiValue, { color: '#4f6ef7' }]}>{stats?.porcentaje ?? 0}%</Text>
            </View>
          </View>

          {/* Barra de progreso */}
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${stats?.porcentaje ?? 0}%` }]} />
          </View>
        </View>

        {/* Actividad reciente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          {recentFeed.map((t, i) => (
            <View key={t.id} style={[styles.row, i % 2 === 0 ? styles.rowEven : {}]}>
              <Text style={styles.rowText}>
                {t.titulo}
              </Text>
              <Text style={[styles.rowStatus,
                { color: t.completada ? '#10b981' : '#f59e0b' }]}>
                {t.completada ? 'Completada' : 'Pendiente'}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>TaskApp — Reporte automático</Text>
          <Text style={styles.footerText}>{fecha}</Text>
        </View>

      </Page>
    </Document>
  )
}