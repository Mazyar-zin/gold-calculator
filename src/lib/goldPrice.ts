import type { AppSettings, GoldKarat } from '../types'

export function sourcePriceForKarat(
  settings: AppSettings,
  karat: GoldKarat,
): number {
  if (settings.priceMode === 'api') {
    if (karat === 18 && settings.apiPrice18 > 0) return settings.apiPrice18
    if (karat === 24 && settings.apiPrice24 > 0) return settings.apiPrice24
  }

  if (karat === 18) return settings.manualPrice18
  return Math.round(settings.manualPrice18 * (24 / 18))
}

export function convertKaratPrice(
  price: number,
  from: GoldKarat,
  to: GoldKarat,
): number {
  if (from === to) return price
  return to === 24
    ? Math.round(price * (24 / 18))
    : Math.round(price * (18 / 24))
}
