import type { AppSettings, GoldKarat } from '../types'

export function priceForKarat(settings: AppSettings, karat: GoldKarat): number {
  if (karat === 18) return settings.goldPrice18
  return Math.round(settings.goldPrice18 * (24 / 18))
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
