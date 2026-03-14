// src/hooks/useListas.ts
import { useState, useEffect, useCallback } from 'react'
import { listaService } from '../services/listaService'
import { useAuthContext } from '../context/AuthContext'

export function useListas() {
  const { user }                        = useAuthContext()
  const [propias,      setPropias]      = useState<any[]>([])
  const [compartidas,  setCompartidas]  = useState<any[]>([])
  const [listaActiva,  setListaActiva]  = useState<any>(null)
  const [loading,      setLoading]      = useState(true)

  const cargar = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { propias, compartidas } = await listaService.getMisListas(user.id)
    setPropias(propias)
    setCompartidas(compartidas)
    setLoading(false)
  }, [user])

  useEffect(() => { cargar() }, [cargar])

  const crearLista = async (nombre: string) => {
    if (!user) return
    const { data, error } = await listaService.crear(nombre, user.id)
    if (error) throw error
    setPropias(prev => [...prev, data])
    return data
  }

  const compartirLista = async (listaId: string, email: string,
    rol: 'viewer' | 'editor') => {
    await listaService.compartir(listaId, email, rol)
    await cargar()
  }

  const eliminarLista = async (listaId: string) => {
    await listaService.eliminar(listaId)
    setPropias(prev => prev.filter(l => l.id !== listaId))
    if (listaActiva?.id === listaId) setListaActiva(null)
  }

  return { propias, compartidas, listaActiva, setListaActiva,
           loading, crearLista, compartirLista, eliminarLista, cargar }
}