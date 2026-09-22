import { useEffect, useMemo, useState } from 'react'
import type { AppSettings, GoldKarat } from '../types'
import { calculateGold } from '../lib/calculator'
import { formatNumber, formatToman } from '../lib/format'
import { convertKaratPrice, sourcePriceForKarat } from '../lib/goldPrice'
import { Icon } from '../components/Icon'
import { MoneyField } from '../components/MoneyField'
import { NumberField } from '../components/NumberField'
import { TopBar } from '../components/TopBar'

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
  const sourceGramPrice = sourcePriceForKarat(settings, karat)
  const [gramPrice, setGramPrice] = useState(
    sourcePriceForKarat(settings, settings.defaultKarat),
  )
  const [budget, setBudget] = useState(0)

  useEffect(() => {
    setGramPrice(sourceGramPrice)
  }, [sourceGramPrice])

  const oneGramResult = useMemo(
    () =>
      calculateGold({
        karat,
        weight: 1,
        gramPrice,
        wagePercent: settings.wagePercent,
        profitPercent: settings.profitPercent,
        taxPercent: settings.taxPercent,
      }),
    [
      karat,
      gramPrice,
      settings.wagePercent,
      settings.profitPercent,
      settings.taxPercent,
    ],
  )

  const estimatedWeight =
    budget > 0 && oneGramResult.total > 0
      ? budget / oneGramResult.total
      : 0

  const estimatedResult = useMemo(
    () =>
      calculateGold({
        karat,
        weight: estimatedWeight,
        gramPrice,
        wagePercent: settings.wagePercent,
        profitPercent: settings.profitPercent,
        taxPercent: settings.taxPercent,
      }),
    [
      karat,
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
    setGramPrice(convertKaratPrice(gramPrice, karat, next))
    onSettingsChange({ ...settings, defaultKarat: next })
  }

  function updatePercent(
    key: 'wagePercent' | 'profitPercent' | 'taxPercent',
    value: number,
  ) {
    onSettingsChange({ ...settings, [key]: value })
  }

  const percentIcon = <Icon name="percent" size={18} />

  return (
    <main className="screen reverse-screen">
      <TopBar title="محاسبه معکوس" onMenu={onMenu} />

      <section className="reverse-intro">
        مبلغی که می‌خواهی هزینه کنی را وارد کن تا وزن تقریبی طلا محاسبه شود.
      </section>

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
          <MoneyField
            label="مبلغ نهایی"
            value={budget}
            onChange={setBudget}
          />

          <MoneyField
            label="قیمت هر گرم"
            value={gramPrice}
            onChange={setGramPrice}
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

      <section className="reverse-result-card">
        <span className="reverse-result-label">وزن تقریبی قابل خرید</span>

        <div className="reverse-weight">
          <strong>{formatNumber(Number(estimatedWeight.toFixed(3)))}</strong>
          <span>گرم</span>
        </div>

        <div className="reverse-summary">
          <div>
            <span>هزینه تقریبی هر گرم با مخارج</span>
            <b>{formatToman(oneGramResult.total)}</b>
          </div>
          <div>
            <span>مبلغ محاسبه‌شده</span>
            <b>{formatToman(estimatedResult.total)}</b>
          </div>
        </div>

        <p className="reverse-note">
          وزن نمایش‌داده‌شده تقریبی است و بر اساس درصدهای فعلی برنامه محاسبه می‌شود.
        </p>
      </section>
    </main>
  )
}
