import { useState } from 'react'
import type { AppSettings, PriceMode, ThemeMode } from '../types'
import { formatToman } from '../lib/format'
import { fetchGoldPrices } from '../lib/goldApi'
import { MoneyField } from '../components/MoneyField'
import { NumberField } from '../components/NumberField'
import { Icon } from '../components/Icon'
import { TopBar } from '../components/TopBar'

interface Props {
  settings: AppSettings
  onChange: (settings: AppSettings) => void
  onMenu: () => void
}

export function SettingsPage({ settings, onChange, onMenu }: Props) {
  const [apiLoading, setApiLoading] = useState(false)
  const [apiMessage, setApiMessage] = useState<string | null>(null)
  const [apiError, setApiError] = useState(false)

  function set<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    onChange({ ...settings, [key]: value })
  }

  function selectPriceMode(mode: PriceMode) {
    set('priceMode', mode)
    setApiMessage(null)
  }

  function selectTheme(theme: ThemeMode) {
    set('theme', theme)
  }

  async function refreshApi() {
    setApiLoading(true)
    setApiMessage(null)
    setApiError(false)

    try {
      const result = await fetchGoldPrices(settings.apiKey)
      onChange({
        ...settings,
        apiPrice18: result.price18Toman,
        apiPrice24: result.price24Toman,
        apiUpdatedAt: result.businessTime ?? new Date().toISOString(),
        apiFetchedAt: new Date().toISOString(),
      })
      setApiMessage('قیمت‌های ۱۸ و ۲۴ عیار بروزرسانی شدند.')
    } catch (error) {
      setApiError(true)
      setApiMessage(
        error instanceof Error ? error.message : 'خطا در دریافت قیمت.',
      )
    } finally {
      setApiLoading(false)
    }
  }

  return (
    <main className="screen">
      <TopBar
        title="تنظیمات"
        onMenu={onMenu}
        action={
          <div className="brand-mark subtle">
            <Icon name="settings" size={19} />
          </div>
        }
      />

      <section className="settings-section">
        <div className="section-title">
          <h2>منبع قیمت طلا</h2>
        </div>

        <div className="segmented">
          <button
            type="button"
            className={settings.priceMode === 'manual' ? 'active' : ''}
            onClick={() => selectPriceMode('manual')}
          >
            قیمت دستی
          </button>
          <button
            type="button"
            className={settings.priceMode === 'api' ? 'active' : ''}
            onClick={() => selectPriceMode('api')}
          >
            دریافت API
          </button>
        </div>

        {settings.priceMode === 'manual' ? (
          <div className="settings-card">
            <MoneyField
              label="قیمت پایه هر گرم طلای ۱۸ عیار"
              value={settings.manualPrice18}
              onChange={(v) => set('manualPrice18', v)}
            />
            <p className="card-note">
              در حالت دستی، قیمت ۲۴ عیار از نسبت عیار محاسبه می‌شود و داخل صفحه
              محاسبه نیز قابل تغییر است.
            </p>
          </div>
        ) : (
          <div className="settings-card api-card">
            <label className="field">
              <span className="field-label">کلید API</span>
              <span className="input-shell api-key-shell">
                <input
                  type="password"
                  dir="ltr"
                  autoComplete="off"
                  value={settings.apiKey}
                  onChange={(event) => set('apiKey', event.target.value)}
                  placeholder="pk_live_..."
                  aria-label="کلید API"
                />
              </span>
            </label>

            <div className="api-price-grid">
              <div className="api-price-item">
                <span>۱۸ عیار</span>
                <strong>
                  {settings.apiPrice18 > 0
                    ? formatToman(settings.apiPrice18)
                    : '—'}
                </strong>
              </div>
              <div className="api-price-item">
                <span>۲۴ عیار</span>
                <strong>
                  {settings.apiPrice24 > 0
                    ? formatToman(settings.apiPrice24)
                    : '—'}
                </strong>
              </div>
            </div>

            <div className="api-status">
              <span
                className={
                  settings.apiPrice18 > 0 && settings.apiPrice24 > 0
                    ? 'status-dot online'
                    : 'status-dot'
                }
              />
              <div>
                <strong>
                  {settings.apiPrice18 > 0 && settings.apiPrice24 > 0
                    ? 'قیمت API آماده است'
                    : 'هنوز قیمتی دریافت نشده'}
                </strong>
                <small>
                  هر دو عیار با یک درخواست دریافت می‌شوند.
                </small>
              </div>
            </div>

            {settings.apiUpdatedAt && (
              <p className="api-time">
                زمان قیمت بازار:{' '}
                {new Date(settings.apiUpdatedAt).toLocaleString('fa-IR')}
              </p>
            )}

            {settings.apiFetchedAt && (
              <p className="api-time">
                آخرین دریافت برنامه:{' '}
                {new Date(settings.apiFetchedAt).toLocaleString('fa-IR')}
              </p>
            )}

            <label className="auto-refresh-row">
              <span>
                <b>بروزرسانی خودکار</b>
                <small>هنگام نیاز و حداکثر هر ۶۰ دقیقه</small>
              </span>
              <input
                type="checkbox"
                checked={settings.apiAutoRefresh}
                onChange={(event) =>
                  set('apiAutoRefresh', event.target.checked)
                }
              />
              <span className="switch-ui" aria-hidden="true" />
            </label>

            {apiMessage && (
              <p
                className={
                  apiError ? 'api-message error' : 'api-message success'
                }
              >
                {apiMessage}
              </p>
            )}

            <button
              className="secondary-button api-refresh-button"
              type="button"
              onClick={refreshApi}
              disabled={apiLoading || !settings.apiKey.trim()}
            >
              <Icon name="refresh" size={17} />
              {apiLoading ? 'در حال دریافت...' : 'بروزرسانی الان'}
            </button>

            <p className="card-note">
              کلید API در همین مرورگر ذخیره می‌شود. این روش برای استفاده شخصی
              مناسب است.
            </p>
          </div>
        )}
      </section>

      <section className="settings-section">
        <div className="section-title">
          <h2>درصدهای پیش‌فرض</h2>
        </div>
        <div className="settings-card settings-percent-grid">
          <NumberField
            label="اجرت"
            value={settings.wagePercent}
            onChange={(v) => set('wagePercent', v)}
            suffix={<Icon name="percent" size={18} />}
            compact
          />
          <NumberField
            label="سود"
            value={settings.profitPercent}
            onChange={(v) => set('profitPercent', v)}
            suffix={<Icon name="percent" size={18} />}
            compact
          />
          <NumberField
            label="مالیات"
            value={settings.taxPercent}
            onChange={(v) => set('taxPercent', v)}
            suffix={<Icon name="percent" size={18} />}
            compact
          />
        </div>
      </section>

      <section className="settings-section">
        <div className="section-title">
          <h2>ظاهر</h2>
        </div>
        <div className="theme-picker">
          {[
            ['light', 'روشن'],
            ['dark', 'تیره'],
            ['system', 'خودکار'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => selectTheme(value as ThemeMode)}
              className={settings.theme === value ? 'active' : ''}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
