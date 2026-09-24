import { Icon } from '../components/Icon'
import { MoneyField } from '../components/MoneyField'
import { NumberField } from '../components/NumberField'
import { TopBar } from '../components/TopBar'
import type { AppSettings, ThemeMode } from '../types'

interface Props {
  settings: AppSettings
  onChange: (settings: AppSettings) => void
  onMenu: () => void
}

const APP_VERSION = '1.7.1'

export function SettingsPage({ settings, onChange, onMenu }: Props) {
  function set<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    onChange({ ...settings, [key]: value })
  }

  return (
    <main className="screen">
      <TopBar
        title="تنظیمات"
        onMenu={onMenu}
        action={
          <div className="brand-mark">
            <Icon name="settings" size={19} />
          </div>
        }
      />

      <section className="settings-section">
        <div className="section-title">
          <h2>قیمت طلا</h2>
          <p>هر دو قیمت به تومان ذخیره می‌شوند و بعد از بستن برنامه باقی می‌مانند.</p>
        </div>
        <div className="settings-card price-settings-card">
          <MoneyField
            label="قیمت هر گرم طلای ۱۸ عیار"
            value={settings.goldPrice18}
            onChange={(value) => set('goldPrice18', value)}
          />
          <MoneyField
            label="قیمت هر گرم طلای ۲۴ عیار"
            value={settings.goldPrice24}
            onChange={(value) => set('goldPrice24', value)}
          />
        </div>
      </section>

      <section className="settings-section">
        <div className="section-title">
          <h2>درصدهای پیش‌فرض</h2>
          <p>با لمس هر فیلد، مقدار فعلی انتخاب می‌شود تا سریع‌تر عدد جدید را وارد کنی.</p>
        </div>
        <div className="settings-card settings-percent-grid">
          <NumberField
            label="اجرت"
            value={settings.wagePercent}
            onChange={(value) => set('wagePercent', value)}
            suffix={<Icon name="percent" size={18} />}
            selectOnFocus
          />
          <NumberField
            label="سود"
            value={settings.profitPercent}
            onChange={(value) => set('profitPercent', value)}
            suffix={<Icon name="percent" size={18} />}
            selectOnFocus
          />
          <NumberField
            label="مالیات"
            value={settings.taxPercent}
            onChange={(value) => set('taxPercent', value)}
            suffix={<Icon name="percent" size={18} />}
            selectOnFocus
          />
        </div>
      </section>

      <section className="settings-section">
        <div className="section-title">
          <h2>ظاهر برنامه</h2>
          <p>حالت نمایش را به صورت روشن، تیره یا هماهنگ با دستگاه انتخاب کن.</p>
        </div>
        <div className="settings-card">
          <div className="theme-picker">
            {[
              ['light', 'روشن'],
              ['dark', 'تیره'],
              ['system', 'خودکار'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => set('theme', value as ThemeMode)}
                className={settings.theme === value ? 'active' : ''}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="settings-section app-version-section">
        <div className="app-version-card">
          <span>نسخه برنامه</span>
          <strong>{APP_VERSION}</strong>
        </div>
      </section>
    </main>
  )
}
