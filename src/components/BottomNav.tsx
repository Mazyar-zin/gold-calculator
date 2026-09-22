import type { PageName } from '../types'
import { Icon } from './Icon'

interface Props {
  page: PageName
  onChange: (page: PageName) => void
  onOpenMenu: () => void
}

export function BottomNav({ page, onChange, onOpenMenu }: Props) {
  const featuresActive = page === 'calculator' || page === 'reverse' || page === 'chart'

  return (
    <nav className="bottom-nav" aria-label="ناوبری اصلی">
      <button
        type="button"
        className={featuresActive ? 'nav-item active' : 'nav-item'}
        onClick={onOpenMenu}
      >
        <span className="nav-icon"><Icon name="menu" size={20} /></span>
        <span>قابلیت‌ها</span>
      </button>

      <button
        type="button"
        className={page === 'history' ? 'nav-item active' : 'nav-item'}
        onClick={() => onChange('history')}
      >
        <span className="nav-icon"><Icon name="history" size={20} /></span>
        <span>تاریخچه</span>
      </button>

      <button
        type="button"
        className={page === 'settings' ? 'nav-item active' : 'nav-item'}
        onClick={() => onChange('settings')}
      >
        <span className="nav-icon"><Icon name="settings" size={20} /></span>
        <span>تنظیمات</span>
      </button>
    </nav>
  )
}
