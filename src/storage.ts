import { freshDemoData } from './data'
import type { AppData } from './types'

const STORAGE_KEY = 'luizera-wireframe-v1'

export function loadData(): AppData {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as AppData
  } catch {
    // O protótipo continua com os dados de demonstração se o armazenamento falhar.
  }
  return freshDemoData()
}

export function saveData(data: AppData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Sem armazenamento disponível: o protótipo continua só em memória.
  }
}

export function resetData(): AppData {
  const data = freshDemoData()
  saveData(data)
  return data
}
