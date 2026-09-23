import type { PageName } from '../types'
import { Icon } from './Icon'

interface Props {
  open: boolean
  page: PageName
  onClose: () => void
  onNavigate: (page: PageName) => void
}

const items = [
  { page: 'reverse' as PageName, label: 'محاسبه معکوس', icon: 'swap' as const },
  { page: 'utility' as PageName, label: 'ماشین حساب', icon: 'calculator' as const },
]

export function FeatureMenu({ open, page, onClose, onNavigate }: Props) {
  return (
    <>
      <button
        className={open ? 'menu-backdrop open features-backdrop' : 'menu-backdrop features-backdrop'}
        type="button"
        aria-label="بستن منوی قابلیت‌ها"
        onClick={onClose}
      />

      <aside
        className={open ? 'feature-menu open' : 'feature-menu'}
        aria-hidden={!open}
        aria-label="قابلیت‌های برنامه"
      >
        <div className="feature-menu-head">
          <strong>قابلیت‌ها</strong>
          <button className="feature-menu-close" type="button" onClick={onClose} aria-label="بستن">
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="feature-menu-grid">
          {items.map((item) => (
            <button
              key={item.page}
              type="button"
              className={page === item.page ? 'feature-item active' : 'feature-item'}
              onClick={() => {
                onNavigate(item.page)
                onClose()
              }}
            >
              <span className="feature-item-icon">
                <Icon name={item.icon} size={18} />
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  )
}
