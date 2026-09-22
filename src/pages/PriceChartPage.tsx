import { useMemo, useState } from 'react'
import type { AppSettings, GoldKarat, PriceSnapshot } from '../types'
import { formatNumber, formatToman } from '../lib/format'
import { sourcePriceForKarat } from '../lib/goldPrice'
import { Icon } from '../components/Icon'
import { TopBar } from '../components/TopBar'

interface Props {
  settings: AppSettings
  history: PriceSnapshot[]
  onAddSnapshot: (snapshot: PriceSnapshot) => void
  onClear: () => void
  onMenu: () => void
}

function chartPath(values: number[], width = 320, height = 150, pad = 12) {
  if (values.length === 0) return ''
  if (values.length === 1) return `M ${width / 2} ${height / 2}`

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = Math.max(max - min, 1)
  const usableW = width - pad * 2
  const usableH = height - pad * 2

  return values
    .map((value, index) => {
      const x = pad + (index / (values.length - 1)) * usableW
      const y = pad + (1 - (value - min) / range) * usableH
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

export function PriceChartPage({
  settings,
  history,
  onAddSnapshot,
  onClear,
  onMenu,
}: Props) {
  const [karat, setKarat] = useState<GoldKarat>(settings.defaultKarat)

  const sorted = useMemo(
    () => [...history].sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)),
    [history],
  )

  const recent = sorted.slice(-30)
  const values = recent.map((item) => (karat === 18 ? item.price18 : item.price24))
  const path = chartPath(values)

  const first = values[0] ?? 0
  const last = values[values.length - 1] ?? 0
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 0
  const change = first > 0 ? ((last - first) / first) * 100 : 0

  function addCurrentPrice() {
    const price18 = sourcePriceForKarat(settings, 18)
    const price24 = sourcePriceForKarat(settings, 24)

    if (price18 <= 0 || price24 <= 0) return

    onAddSnapshot({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      source: settings.priceMode,
      price18,
      price24,
    })
  }

  return (
    <main className="screen chart-screen">
      <TopBar
        title="نمودار قیمت"
        onMenu={onMenu}
        action={
          history.length > 0 ? (
            <button
              className="icon-button danger"
              type="button"
              onClick={onClear}
              aria-label="پاک کردن نمودار"
            >
              <Icon name="trash" size={18} />
            </button>
          ) : undefined
        }
      />

      <section className="chart-toolbar">
        <div className="karat-switch chart-karat-switch">
          <button
            type="button"
            className={karat === 18 ? 'active' : ''}
            onClick={() => setKarat(18)}
          >
            ۱۸ عیار
          </button>
          <button
            type="button"
            className={karat === 24 ? 'active' : ''}
            onClick={() => setKarat(24)}
          >
            ۲۴ عیار
          </button>
        </div>

        <button className="snapshot-button" type="button" onClick={addCurrentPrice}>
          <Icon name="chart" size={17} />
          ثبت قیمت فعلی
        </button>
      </section>

      {recent.length === 0 ? (
        <section className="empty-state chart-empty">
          <div className="empty-icon"><Icon name="chart" size={28} /></div>
          <h2>هنوز قیمتی ثبت نشده</h2>
          <p>
            «ثبت قیمت فعلی» را بزن یا از API استفاده کن تا تغییرات قیمت روی نمودار ذخیره شود.
          </p>
        </section>
      ) : (
        <>
          <section className="chart-card">
            <div className="chart-head">
              <div>
                <span>آخرین قیمت</span>
                <strong>{formatToman(last)}</strong>
              </div>
              <span className={change >= 0 ? 'change-badge up' : 'change-badge down'}>
                {change >= 0 ? '+' : ''}
                {formatNumber(Number(change.toFixed(2)))}٪
              </span>
            </div>

            <div className="svg-chart-wrap">
              <svg
                className="price-chart-svg"
                viewBox="0 0 320 150"
                role="img"
                aria-label={`نمودار تغییر قیمت طلای ${karat} عیار`}
              >
                <path className="chart-grid-line" d="M12 38 H308" />
                <path className="chart-grid-line" d="M12 75 H308" />
                <path className="chart-grid-line" d="M12 112 H308" />
                <path className="chart-line" d={path} />
                {values.length === 1 && (
                  <circle className="chart-dot" cx="160" cy="75" r="4" />
                )}
              </svg>
            </div>

            <div className="chart-axis-labels">
              <span>
                {new Date(recent[0].createdAt).toLocaleDateString('fa-IR', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span>
                {new Date(recent[recent.length - 1].createdAt).toLocaleDateString(
                  'fa-IR',
                  { month: 'short', day: 'numeric' },
                )}
              </span>
            </div>
          </section>

          <section className="chart-stats">
            <div>
              <span>کمترین</span>
              <strong>{formatToman(min)}</strong>
            </div>
            <div>
              <span>بیشترین</span>
              <strong>{formatToman(max)}</strong>
            </div>
            <div>
              <span>تعداد ثبت</span>
              <strong>{formatNumber(recent.length)}</strong>
            </div>
          </section>

          <section className="price-log">
            <div className="section-title">
              <h2>آخرین ثبت‌ها</h2>
            </div>

            {[...recent]
              .reverse()
              .slice(0, 8)
              .map((item) => (
                <div className="price-log-row" key={item.id}>
                  <div>
                    <strong>
                      {formatToman(karat === 18 ? item.price18 : item.price24)}
                    </strong>
                    <span>
                      {new Date(item.createdAt).toLocaleString('fa-IR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <span className="mini-badge">
                    {item.source === 'api' ? 'API' : 'دستی'}
                  </span>
                </div>
              ))}
          </section>
        </>
      )}
    </main>
  )
}
