export type ThemeMode = 'light' | 'dark' | 'system'
export type PageName = 'calculator' | 'reverse' | 'utility' | 'tools' | 'settings'
export type GoldKarat = 18 | 24

export interface AppSettings {
  goldPrice18: number
  goldPrice24: number
  wagePercent: number
  profitPercent: number
  taxPercent: number
  theme: ThemeMode
  defaultKarat: GoldKarat
}

export interface CalculationInput {
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
