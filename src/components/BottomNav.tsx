import type { PageName } from '../types'
import { Icon } from './Icon'

interface Props {
  page: PageName
  menuOpen: boolean
  onChange: (page: PageName) => void
  onToggleMenu: () => void
}

export function BottomNav({ page, menuOpen, onChange, onToggleMenu }: Props) {
  const featuresActive = menuOpen || page === 'reverse' || page === 'utility'

  return (
    <nav className="bottom-nav" aria-label="ناوبری اصلی">
      <button
        type="button"
        className={featuresActive ? 'nav-item active' : 'nav-item'}
        onClick={onToggleMenu}
        aria-expanded={menuOpen}
      >
        <span className="nav-icon"><Icon name="menu" size={20} /></span>
        <span>قابلیت‌ها</span>
      </button>

      <button
        type="button"
        className={page === 'calculator' ? 'nav-item active' : 'nav-item'}
        onClick={() => onChange('calculator')}
      >
        <span className="nav-icon"><Icon name="calculator" size={20} /></span>
        <span>طلا</span>
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
