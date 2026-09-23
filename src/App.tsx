import { useEffect, useState } from 'react'
import './styles.css'
import { AppMenu } from './components/AppMenu'
import { BottomNav } from './components/BottomNav'
import { usePwaInstall } from './hooks/usePwaInstall'
import { saveSettings, loadSettings } from './lib/storage'
import { CalculatorPage } from './pages/CalculatorPage'
import { GeneralCalculatorPage } from './pages/GeneralCalculatorPage'
import { ReverseCalculatorPage } from './pages/ReverseCalculatorPage'
import { SettingsPage } from './pages/SettingsPage'
import type { AppSettings, PageName } from './types'

export default function App() {
  const [page, setPage] = useState<PageName>('calculator')
  const [menuOpen, setMenuOpen] = useState(false)
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings())
  const { installed, canInstall, install } = usePwaInstall()

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    function applyTheme() {
      const dark =
        settings.theme === 'dark' ||
        (settings.theme === 'system' && media.matches)

      root.dataset.theme = dark ? 'dark' : 'light'
      root.style.colorScheme = dark ? 'dark' : 'light'

      const themeMeta = document.querySelector<HTMLMetaElement>(
        'meta[name="theme-color"]',
      )
      if (themeMeta) themeMeta.content = dark ? '#0d0f12' : '#f5f1e9'
    }

    applyTheme()
    media.addEventListener('change', applyTheme)
    return () => media.removeEventListener('change', applyTheme)
  }, [settings.theme])

  function navigate(nextPage: PageName) {
    setPage(nextPage)
    setMenuOpen(false)
  }

  let content
  if (page === 'reverse') {
    content = (
      <ReverseCalculatorPage
        settings={settings}
        onSettingsChange={setSettings}
        onMenu={() => setMenuOpen(true)}
      />
    )
  } else if (page === 'utility') {
    content = <GeneralCalculatorPage onMenu={() => setMenuOpen(true)} />
  } else if (page === 'settings') {
    content = (
      <SettingsPage
        settings={settings}
        onChange={setSettings}
        onMenu={() => setMenuOpen(true)}
      />
    )
  } else {
    content = (
      <CalculatorPage
        settings={settings}
        onSettingsChange={setSettings}
        onMenu={() => setMenuOpen(true)}
      />
    )
  }

  return (
    <div className="app-shell">
      <div className="app-frame">
        {content}

        <AppMenu
          open={menuOpen}
          page={page}
          installed={installed}
          canInstall={canInstall}
          onInstall={() => void install()}
          onClose={() => setMenuOpen(false)}
          onNavigate={navigate}
        />

        <BottomNav
          page={page}
          menuOpen={menuOpen}
          onChange={navigate}
          onToggleMenu={() => setMenuOpen((open) => !open)}
        />
      </div>
    </div>
  )
}
