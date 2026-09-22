import { useEffect, useMemo, useState } from 'react'
import { calculateGold } from '../lib/calculator'
import { formatToman } from '../lib/format'
import { convertKaratPrice, sourcePriceForKarat } from '../lib/goldPrice'
import type { AppSettings, GoldKarat, HistoryItem } from '../types'
import { Icon } from '../components/Icon'
import { MoneyField } from '../components/MoneyField'
import { NumberField } from '../components/NumberField'
import { TopBar } from '../components/TopBar'

interface Props {
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
  onAddHistory: (item: HistoryItem) => void
  onMenu: () => void
}

export function CalculatorPage({ settings, onSettingsChange, onAddHistory, onMenu }: Props) {
  const [karat, setKarat] = useState<GoldKarat>(settings.defaultKarat)
  const sourceGramPrice = sourcePriceForKarat(settings, karat)
  const [gramPrice, setGramPrice] = useState(
    sourcePriceForKarat(settings, settings.defaultKarat),
  )
  const [weight, setWeight] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(true)
  const [savedPulse, setSavedPulse] = useState(false)

  useEffect(() => {
    setGramPrice(sourceGramPrice)
  }, [sourceGramPrice])

  const result = useMemo(
    () => calculateGold({
      karat,
      weight,
      gramPrice,
      wagePercent: settings.wagePercent,
      profitPercent: settings.profitPercent,
      taxPercent: settings.taxPercent,
    }),
    [karat, weight, gramPrice, settings.wagePercent, settings.profitPercent, settings.taxPercent],
  )

  function changeKarat(next: GoldKarat) {
    if (next === karat) return

    setKarat(next)
    setGramPrice(convertKaratPrice(gramPrice, karat, next))
    onSettingsChange({ ...settings, defaultKarat: next })
  }

  function updatePercent(key: 'wagePercent' | 'profitPercent' | 'taxPercent', value: number) {
    onSettingsChange({ ...settings, [key]: value })
  }

  function saveCalculation() {
    if (weight <= 0 || gramPrice <= 0) return

    const item: HistoryItem = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      input: {
        karat,
        weight,
        gramPrice,
        wagePercent: settings.wagePercent,
        profitPercent: settings.profitPercent,
        taxPercent: settings.taxPercent,
      },
      result,
    }

    onAddHistory(item)
    setSavedPulse(true)
    window.setTimeout(() => setSavedPulse(false), 1400)
  }

  const percentIcon = <Icon name="percent" size={18} />

  return (
    <main className="screen calculator-screen">
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
            onChange={setGramPrice}
            compact
          />

          <NumberField
            label="وزن"
            value={weight}
            onChange={setWeight}
            suffix="گرم"
            hint="مثال: 3.25"
            compact
          />
        </div>
      </section>

      <section className="percent-card">
        <div className="percent-grid">
          <NumberField
            label="اجرت"
            value={settings.wagePercent}
            onChange={(v) => updatePercent('wagePercent', v)}
            suffix={percentIcon}
            compact
          />
          <NumberField
            label="سود"
            value={settings.profitPercent}
            onChange={(v) => updatePercent('profitPercent', v)}
            suffix={percentIcon}
            compact
          />
          <NumberField
            label="مالیات"
            value={settings.taxPercent}
            onChange={(v) => updatePercent('taxPercent', v)}
            suffix={percentIcon}
            compact
          />
        </div>
      </section>

      <section className="result-card compact-result">
        <div className="result-top">
          <div>
            <span>قیمت نهایی</span>
            <strong>{formatToman(result.total)}</strong>
          </div>
          <span className="result-karat">{karat.toLocaleString('fa-IR')} عیار</span>
        </div>

        <button className="details-toggle" type="button" onClick={() => setDetailsOpen(!detailsOpen)}>
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

        <button
          className="primary-button"
          type="button"
          onClick={saveCalculation}
          disabled={weight <= 0 || gramPrice <= 0}
        >
          {savedPulse ? 'ذخیره شد ✓' : 'ذخیره در تاریخچه'}
        </button>
      </section>
    </main>
  )
}
