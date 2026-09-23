import type { AppSettings, GoldKarat, ThemeMode } from '../types'

const SETTINGS_KEY = 'goldcalc.settings.v3'
const LEGACY_SETTINGS_KEY = 'goldcalc.settings.v2.toman'
const LEGACY_HISTORY_KEY = 'goldcalc.history.v2.toman'
const LEGACY_PRICE_HISTORY_KEY = 'goldcalc.price-history.v1'

export const defaultSettings: AppSettings = {
  goldPrice18: 23_700_000,
  wagePercent: 15,
  profitPercent: 7,
  taxPercent: 10,
  theme: 'light',
  defaultKarat: 18,
}

function finiteNumber(value: unknown, fallback: number) {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : fallback
}

function validTheme(value: unknown): ThemeMode {
  return value === 'dark' || value === 'system' || value === 'light'
    ? value
    : defaultSettings.theme
}

function validKarat(value: unknown): GoldKarat {
  return Number(value) === 24 ? 24 : 18
}

function sanitize(value: Partial<AppSettings> | null | undefined): AppSettings {
  return {
    goldPrice18: finiteNumber(value?.goldPrice18, defaultSettings.goldPrice18),
    wagePercent: finiteNumber(value?.wagePercent, defaultSettings.wagePercent),
    profitPercent: finiteNumber(value?.profitPercent, defaultSettings.profitPercent),
    taxPercent: finiteNumber(value?.taxPercent, defaultSettings.taxPercent),
    theme: validTheme(value?.theme),
    defaultKarat: validKarat(value?.defaultKarat),
  }
}

function migrateLegacy(value: Record<string, unknown>): AppSettings {
  const migrated = sanitize({
    goldPrice18: value.manualPrice18 as number,
    wagePercent: value.wagePercent as number,
    profitPercent: value.profitPercent as number,
    taxPercent: value.taxPercent as number,
    theme: value.theme as ThemeMode,
    defaultKarat: value.defaultKarat as GoldKarat,
  })

  // فقط مقادیر اولیه قدیمی ارتقا پیدا می‌کنند؛ مقدار سفارشی کاربر حفظ می‌شود.
  if (migrated.goldPrice18 === 8_500_000) {
    migrated.goldPrice18 = defaultSettings.goldPrice18
  }
  if (migrated.wagePercent === 18) {
    migrated.wagePercent = defaultSettings.wagePercent
  }
  if (migrated.taxPercent === 9) {
    migrated.taxPercent = defaultSettings.taxPercent
  }

  return migrated
}

export function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) return sanitize(JSON.parse(stored))

    const legacy = localStorage.getItem(LEGACY_SETTINGS_KEY)
    if (legacy) return migrateLegacy(JSON.parse(legacy))
  } catch {
    // اگر داده ذخیره‌شده خراب باشد، برنامه با پیش‌فرض‌های معتبر بالا می‌آید.
  }

  return defaultSettings
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(sanitize(settings)))

  // پاک‌سازی داده‌های نسخه‌های قدیمی و قابلیت‌های حذف‌شده.
  localStorage.removeItem(LEGACY_SETTINGS_KEY)
  localStorage.removeItem(LEGACY_HISTORY_KEY)
  localStorage.removeItem(LEGACY_PRICE_HISTORY_KEY)
}
