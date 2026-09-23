import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import { MoneyField } from '../components/MoneyField'
import { NumberField } from '../components/NumberField'
import { TopBar } from '../components/TopBar'
import { calculateGold } from '../lib/calculator'
import { formatNumber, formatToman } from '../lib/format'
import { convertKaratPrice, priceForKarat } from '../lib/goldPrice'
import type { AppSettings, GoldKarat } from '../types'

interface Props {
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
  onMenu: () => void
}

export function ReverseCalculatorPage({
  settings,
  onSettingsChange,
  onMenu,
}: Props) {
  const [karat, setKarat] = useState<GoldKarat>(settings.defaultKarat)
  const [gramPrice, setGramPrice] = useState(() =>
    priceForKarat(settings, settings.defaultKarat),
  )
  const [budget, setBudget] = useState(0)

  const storedPriceForKarat = priceForKarat(settings, karat)

  useEffect(() => {
    setGramPrice(storedPriceForKarat)
  }, [storedPriceForKarat])

  const oneGramResult = useMemo(
    () =>
      calculateGold({
        weight: 1,
        gramPrice,
        wagePercent: settings.wagePercent,
        profitPercent: settings.profitPercent,
        taxPercent: settings.taxPercent,
      }),
    [
      gramPrice,
      settings.wagePercent,
      settings.profitPercent,
      settings.taxPercent,
    ],
  )

  const estimatedWeight =
    budget > 0 && oneGramResult.total > 0 ? budget / oneGramResult.total : 0

  const estimatedResult = useMemo(
    () =>
      calculateGold({
        weight: estimatedWeight,
        gramPrice,
        wagePercent: settings.wagePercent,
        profitPercent: settings.profitPercent,
        taxPercent: settings.taxPercent,
      }),
    [
      estimatedWeight,
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
    onSettingsChange({
      ...settings,
      goldPrice18: convertKaratPrice(value, karat, 18),
    })
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
      <TopBar title="محاسبه معکوس" onMenu={onMenu} />

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

        <div className="reverse-input-stack">
          <MoneyField label="بودجه" value={budget} onChange={setBudget} />
          <MoneyField
            label="قیمت هر گرم"
            value={gramPrice}
            onChange={updateGramPrice}
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

      <section className="reverse-result-card">
        <span className="reverse-result-label">وزن تقریبی قابل خرید</span>
        <div className="reverse-weight">
          <strong>{formatNumber(estimatedWeight)}</strong>
          <span>گرم</span>
        </div>

        <div className="reverse-summary">
          <div><span>هزینه تقریبی هر گرم</span><b>{formatToman(oneGramResult.total)}</b></div>
          <div><span>قیمت محاسبه‌شده</span><b>{formatToman(estimatedResult.total)}</b></div>
        </div>
      </section>
    </main>
  )
}
