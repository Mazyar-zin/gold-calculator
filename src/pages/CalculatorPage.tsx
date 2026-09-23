import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import { MoneyField } from '../components/MoneyField'
import { NumberField } from '../components/NumberField'
import { TopBar } from '../components/TopBar'
import { calculateGold } from '../lib/calculator'
import { formatToman } from '../lib/format'
import { convertKaratPrice, priceForKarat } from '../lib/goldPrice'
import type { AppSettings, GoldKarat } from '../types'

interface Props {
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
  onMenu: () => void
}

export function CalculatorPage({ settings, onSettingsChange, onMenu }: Props) {
  const [karat, setKarat] = useState<GoldKarat>(settings.defaultKarat)
  const [gramPrice, setGramPrice] = useState(() =>
    priceForKarat(settings, settings.defaultKarat),
  )
  const [weight, setWeight] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(true)

  const storedPriceForKarat = priceForKarat(settings, karat)

  useEffect(() => {
    setGramPrice(storedPriceForKarat)
  }, [storedPriceForKarat])

  const result = useMemo(
    () =>
      calculateGold({
        weight,
        gramPrice,
        wagePercent: settings.wagePercent,
        profitPercent: settings.profitPercent,
        taxPercent: settings.taxPercent,
      }),
    [
      weight,
      gramPrice,
      settings.wagePercent,
      settings.profitPercent,
      settings.taxPercent,
    ],
  )

  function changeKarat(next: GoldKarat) {
    if (next === karat) return
    setKarat(next)
    setGramPrice(priceForKarat(settings, next))
    onSettingsChange({ ...settings, defaultKarat: next })
  }

  function updateGramPrice(value: number) {
    setGramPrice(value)
    const price18 = convertKaratPrice(value, karat, 18)
    onSettingsChange({ ...settings, goldPrice18: price18 })
  }

  function updatePercent(
    key: 'wagePercent' | 'profitPercent' | 'taxPercent',
    value: number,
  ) {
    onSettingsChange({ ...settings, [key]: value })
  }

  const percentIcon = <Icon name="percent" size={18} />

  return (
    <main className="screen">
      <TopBar title="محاسبه‌گر طلا" onMenu={onMenu} />

      <section className="core-card">
        <div className="karat-row">
          <span className="core-label">عیار طلا</span>
          <div className="karat-switch" aria-label="انتخاب عیار طلا">
            <button
              type="button"
              className={karat === 18 ? 'active' : ''}
              onClick={() => changeKarat(18)}
            >
              ۱۸ عیار
            </button>
            <button
              type="button"
              className={karat === 24 ? 'active' : ''}
              onClick={() => changeKarat(24)}
            >
              ۲۴ عیار
            </button>
          </div>
        </div>

        <div className="core-input-grid">
          <MoneyField
            label="قیمت هر گرم"
            value={gramPrice}
            onChange={updateGramPrice}
          />

          <NumberField
            label="وزن"
            value={weight}
            onChange={setWeight}
            suffix="گرم"
            hint="مثال: 3.25"
          />
        </div>
      </section>

      <section className="percent-card">
        <div className="percent-grid">
          <NumberField
            label="اجرت"
            value={settings.wagePercent}
            onChange={(value) => updatePercent('wagePercent', value)}
            suffix={percentIcon}
            selectOnFocus
          />
          <NumberField
            label="سود"
            value={settings.profitPercent}
            onChange={(value) => updatePercent('profitPercent', value)}
            suffix={percentIcon}
            selectOnFocus
          />
          <NumberField
            label="مالیات"
            value={settings.taxPercent}
            onChange={(value) => updatePercent('taxPercent', value)}
            suffix={percentIcon}
            selectOnFocus
          />
        </div>
      </section>

      <section className="result-card">
        <div className="result-top">
          <div>
            <span>قیمت نهایی</span>
            <strong>{formatToman(result.total)}</strong>
          </div>
          <span className="result-karat">
            {karat.toLocaleString('fa-IR')} عیار
          </span>
        </div>

        <button
          className="details-toggle"
          type="button"
          onClick={() => setDetailsOpen((open) => !open)}
          aria-expanded={detailsOpen}
        >
          <span>جزئیات محاسبه</span>
          <span className={detailsOpen ? 'chevron open' : 'chevron'}>
            <Icon name="chevron" size={17} />
          </span>
        </button>

        {detailsOpen && (
          <div className="breakdown">
            <div><span>قیمت خام</span><b>{formatToman(result.rawPrice)}</b></div>
            <div><span>اجرت</span><b>{formatToman(result.wage)}</b></div>
            <div><span>سود</span><b>{formatToman(result.profit)}</b></div>
            <div><span>مالیات</span><b>{formatToman(result.tax)}</b></div>
          </div>
        )}
      </section>
    </main>
  )
}
