export type PriceMode = 'manual' | 'api'
export type ThemeMode = 'light' | 'dark' | 'system'
export type PageName = 'calculator' | 'reverse' | 'chart' | 'history' | 'settings'
export type GoldKarat = 18 | 24

export interface AppSettings {
  priceMode: PriceMode
  manualPrice18: number
  apiPrice18: number
  apiPrice24: number
  apiUpdatedAt: string | null
  apiFetchedAt: string | null
  apiKey: string
  apiAutoRefresh: boolean
  wagePercent: number
  profitPercent: number
  taxPercent: number
  theme: ThemeMode
  defaultKarat: GoldKarat
}

export interface CalculationInput {
  karat: GoldKarat
  weight: number
  gramPrice: number
  wagePercent: number
  profitPercent: number
  taxPercent: number
}

export interface CalculationResult {
  rawPrice: number
  wage: number
  profit: number
  tax: number
  total: number
}

export interface HistoryItem {
  id: string
  createdAt: string
  input: CalculationInput
  result: CalculationResult
}


export interface PriceSnapshot {
  id: string
  createdAt: string
  source: PriceMode
  price18: number
  price24: number
}
