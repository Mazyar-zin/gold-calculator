import type { AppSettings, HistoryItem, PriceSnapshot } from '../types'

const SETTINGS_KEY = 'goldcalc.settings.v2.toman'
const HISTORY_KEY = 'goldcalc.history.v2.toman'
const PRICE_HISTORY_KEY = 'goldcalc.price-history.v1'

export const defaultSettings: AppSettings = {
  priceMode: 'manual',
  manualPrice18: 8500000,
  apiPrice18: 0,
  apiPrice24: 0,
  apiUpdatedAt: null,
  apiFetchedAt: null,
  apiKey: '',
  apiAutoRefresh: true,
  wagePercent: 18,
  profitPercent: 7,
  taxPercent: 9,
  theme: 'light',
  defaultKarat: 18,
}

export function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (!stored) return defaultSettings
    return { ...defaultSettings, ...JSON.parse(stored) }
  } catch {
    return defaultSettings
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveHistory(history: HistoryItem[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)))
}


export function loadPriceHistory(): PriceSnapshot[] {
  try {
    const stored = localStorage.getItem(PRICE_HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function savePriceHistory(history: PriceSnapshot[]) {
  localStorage.setItem(
    PRICE_HISTORY_KEY,
    JSON.stringify(history.slice(0, 120)),
  )
}
