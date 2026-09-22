const fa = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 })
const moneyInput = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '۰'
  return fa.format(value)
}

export function formatToman(value: number): string {
  return `${formatNumber(Math.round(value))} تومان`
}

export function formatMoneyInput(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return ''
  return moneyInput.format(Math.round(value))
}

export function normalizeDigits(value: string): string {
  const faDigits = '۰۱۲۳۴۵۶۷۸۹'
  const arDigits = '٠١٢٣٤٥٦٧٨٩'

  let normalized = value
    .replace(/[۰-۹]/g, (d) => String(faDigits.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(arDigits.indexOf(d)))
    .replace(/[٫،]/g, '.')
    .replace(/,/g, '')
    .replace(/[^\d.]/g, '')

  const firstDot = normalized.indexOf('.')
  if (firstDot !== -1) {
    normalized =
      normalized.slice(0, firstDot + 1) +
      normalized.slice(firstDot + 1).replace(/\./g, '')
  }

  return normalized
}

export function parseNumber(value: string): number {
  const n = Number(normalizeDigits(value))
  return Number.isFinite(n) ? n : 0
}
