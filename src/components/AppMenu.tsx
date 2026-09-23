import type { PageName } from '../types'
import { Icon } from './Icon'

interface Props {
  open: boolean
  page: PageName
  installed: boolean
  canInstall: boolean
  onInstall: () => void
  onClose: () => void
  onNavigate: (page: PageName) => void
}

const items = [
  { page: 'calculator' as PageName, label: 'محاسبه طلا', icon: 'calculator' as const },
  { page: 'reverse' as PageName, label: 'محاسبه معکوس', icon: 'swap' as const },
  { page: 'utility' as PageName, label: 'ماشین حساب', icon: 'calculator' as const },
  { page: 'settings' as PageName, label: 'تنظیمات', icon: 'settings' as const },
]

export function AppMenu({
  open,
  page,
  installed,
  canInstall,
  onInstall,
  onClose,
  onNavigate,
}: Props) {
  return (
    <>
      <button
        className={open ? 'menu-backdrop open top-menu-backdrop' : 'menu-backdrop top-menu-backdrop'}
        type="button"
        aria-label="بستن منو"
        onClick={onClose}
      />

      <aside
        className={open ? 'app-menu open' : 'app-menu'}
        aria-hidden={!open}
        aria-label="منوی برنامه"
      >
        <div className="menu-head">
          <div>
            <strong>منوی برنامه</strong>
            <span className="menu-head-subtitle">دسترسی سریع به صفحات و ابزارها</span>
          </div>
          <button className="menu-close" type="button" onClick={onClose} aria-label="بستن منو">
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="menu-group">
          {items.map((item) => (
            <button
              key={item.page}
              type="button"
              className={page === item.page ? 'menu-item active' : 'menu-item'}
              onClick={() => {
                onNavigate(item.page)
                onClose()
              }}
            >
              <span className="menu-item-icon">
                <Icon name={item.icon} size={19} />
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {!installed && canInstall && (
          <button
            className="compact-install-button"
            type="button"
            onClick={() => {
              onInstall()
              onClose()
            }}
          >
            <Icon name="download" size={17} />
            <span>نصب برنامه روی موبایل</span>
          </button>
        )}
      </aside>
    </>
  )
}
