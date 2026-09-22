import { useEffect, useMemo, useState } from 'react'
import './styles.css'
import { BottomNav } from './components/BottomNav'
import { AppMenu } from './components/AppMenu'
import { Icon } from './components/Icon'
import { CalculatorPage } from './pages/CalculatorPage'
import { HistoryPage } from './pages/HistoryPage'
import { SettingsPage } from './pages/SettingsPage'
import { ReverseCalculatorPage } from './pages/ReverseCalculatorPage'
import { PriceChartPage } from './pages/PriceChartPage'
import { fetchGoldPrices } from './lib/goldApi'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { usePwaInstall } from './hooks/usePwaInstall'
import {
  loadHistory,
  loadPriceHistory,
  loadSettings,
  saveHistory,
  savePriceHistory,
  saveSettings,
} from './lib/storage'
import type {
  AppSettings,
  HistoryItem,
  PageName,
  PriceSnapshot,
} from './types'

const AUTO_REFRESH_MS = 60 * 60 * 1000

export default function App() {
  const [page, setPage] = useState<PageName>('calculator')
  const [menuOpen, setMenuOpen] = useState(false)
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings())
  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory())
  const [priceHistory, setPriceHistory] = useState<PriceSnapshot[]>(() =>
    loadPriceHistory(),
  )
  const online = useOnlineStatus()
  const { installed, canInstall, install } = usePwaInstall()

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    saveHistory(history)
  }, [history])

  useEffect(() => {
    savePriceHistory(priceHistory)
  }, [priceHistory])

  useEffect(() => {
    const root = document.documentElement
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    const dark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && prefersDark)
    root.dataset.theme = dark ? 'dark' : 'light'

    const themeMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    )
    if (themeMeta) {
      themeMeta.content = dark ? '#11100e' : '#f5f1e9'
    }
  }, [settings.theme])

  function addPriceSnapshot(
    price18: number,
    price24: number,
    source: 'manual' | 'api',
  ) {
    if (price18 <= 0 || price24 <= 0) return

    setPriceHistory((previous) => {
      const last = previous[0]
      const now = Date.now()

      // Avoid near-duplicate automatic points.
      if (
        last &&
        last.price18 === price18 &&
        last.price24 === price24 &&
        now - Date.parse(last.createdAt) < 5 * 60 * 1000
      ) {
        return previous
      }

      const item: PriceSnapshot = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        source,
        price18,
        price24,
      }

      return [item, ...previous].slice(0, 120)
    })
  }

  useEffect(() => {
    if (
      settings.priceMode !== 'api' ||
      !settings.apiAutoRefresh ||
      !settings.apiKey.trim() ||
      !online
    ) {
      return
    }

    let cancelled = false
    let running = false

    async function refreshIfStale(force = false) {
      if (running) return

      const lastTime = settings.apiFetchedAt
        ? Date.parse(settings.apiFetchedAt)
        : 0
      const stale =
        !Number.isFinite(lastTime) ||
        lastTime <= 0 ||
        Date.now() - lastTime >= AUTO_REFRESH_MS

      if (!force && !stale) return

      running = true
      try {
        const result = await fetchGoldPrices(settings.apiKey)
        if (cancelled) return

        setSettings((previous) => ({
          ...previous,
          apiPrice18: result.price18Toman,
          apiPrice24: result.price24Toman,
          apiUpdatedAt: result.businessTime ?? new Date().toISOString(),
          apiFetchedAt: new Date().toISOString(),
        }))

        addPriceSnapshot(
          result.price18Toman,
          result.price24Toman,
          'api',
        )
      } catch {
        // Last known price remains usable if auto-refresh fails.
      } finally {
        running = false
      }
    }

    refreshIfStale()

    const intervalId = window.setInterval(() => {
      refreshIfStale(true)
    }, AUTO_REFRESH_MS)

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshIfStale()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [
    settings.priceMode,
    settings.apiAutoRefresh,
    settings.apiKey,
    settings.apiFetchedAt,
    online,
  ])

  const content = useMemo(() => {
    if (page === 'reverse') {
      return (
        <ReverseCalculatorPage
          settings={settings}
          onSettingsChange={setSettings}
          onMenu={() => setMenuOpen(true)}
        />
      )
    }

    if (page === 'chart') {
      return (
        <PriceChartPage
          settings={settings}
          history={priceHistory}
          onAddSnapshot={(snapshot) =>
            setPriceHistory((previous) => [snapshot, ...previous].slice(0, 120))
          }
          onClear={() => setPriceHistory([])}
          onMenu={() => setMenuOpen(true)}
        />
      )
    }

    if (page === 'history') {
      return (
        <HistoryPage
          history={history}
          onClear={() => setHistory([])}
          onMenu={() => setMenuOpen(true)}
        />
      )
    }

    if (page === 'settings') {
      return (
        <SettingsPage
          settings={settings}
          onChange={setSettings}
          onMenu={() => setMenuOpen(true)}
        />
      )
    }

    return (
      <CalculatorPage
        settings={settings}
        onSettingsChange={setSettings}
        onAddHistory={(item) =>
          setHistory((previous) => [item, ...previous].slice(0, 50))
        }
        onMenu={() => setMenuOpen(true)}
      />
    )
  }, [page, settings, history, priceHistory])

  return (
    <div className="app-shell">
      <div className="app-frame">
        {!online && (
          <div className="offline-banner" role="status">
            <Icon name="wifiOff" size={15} />
            <span>آفلاین — محاسبات و اطلاعات ذخیره‌شده همچنان در دسترس‌اند.</span>
          </div>
        )}
        {content}
        <BottomNav
          page={page}
          onChange={setPage}
          onOpenMenu={() => setMenuOpen(true)}
        />
        <AppMenu
          open={menuOpen}
          page={page}
          installed={installed}
          canInstall={canInstall}
          onInstall={() => void install()}
          onClose={() => setMenuOpen(false)}
          onNavigate={setPage}
        />
      </div>
    </div>
  )
}
