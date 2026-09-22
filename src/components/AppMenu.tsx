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

const currentItems = [
  { page: 'calculator' as PageName, label: 'محاسبه قیمت طلا', icon: 'calculator' as const },
  { page: 'reverse' as PageName, label: 'محاسبه معکوس', icon: 'swap' as const },
  { page: 'chart' as PageName, label: 'نمودار تغییر قیمت', icon: 'chart' as const },
  { page: 'history' as PageName, label: 'تاریخچه محاسبات', icon: 'history' as const },
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
        className={open ? 'menu-backdrop open' : 'menu-backdrop'}
        type="button"
        aria-label="بستن منو"
        onClick={onClose}
      />

      <aside className={open ? 'app-menu open' : 'app-menu'} aria-hidden={!open}>
        <div className="menu-head">
          <div>
            <strong>قابلیت‌ها</strong>
            <span>محاسبه‌گر طلا</span>
          </div>
          <button className="menu-close" type="button" onClick={onClose} aria-label="بستن منو">
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="menu-group">
          {currentItems.map((item) => (
            <button
              key={item.page}
              type="button"
              className={page === item.page ? 'menu-item active' : 'menu-item'}
              onClick={() => {
                onNavigate(item.page)
                onClose()
              }}
            >
              <span className="menu-item-icon"><Icon name={item.icon} size={19} /></span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="menu-app-section">
          {installed ? (
            <div className="install-state installed">
              <span className="install-state-icon"><Icon name="check" size={18} /></span>
              <span>
                <b>برنامه نصب شده</b>
                <small>از صفحه اصلی گوشی مثل یک اپ باز می‌شود.</small>
              </span>
            </div>
          ) : canInstall ? (
            <button
              className="install-button"
              type="button"
              onClick={() => {
                onInstall()
                onClose()
              }}
            >
              <span className="install-state-icon"><Icon name="download" size={18} /></span>
              <span>
                <b>نصب روی موبایل</b>
                <small>بدون نیاز به فروشگاه برنامه</small>
              </span>
            </button>
          ) : (
            <div className="install-state">
              <span className="install-state-icon"><Icon name="download" size={18} /></span>
              <span>
                <b>نصب روی صفحه اصلی</b>
                <small>از منوی مرورگر «Add to Home Screen» را انتخاب کن.</small>
              </span>
            </div>
          )}
        </div>

        <div className="menu-version">نسخه ۱.۲</div>
      </aside>
    </>
  )
}
