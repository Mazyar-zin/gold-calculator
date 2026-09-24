import { useState } from 'react'
import { TopBar } from '../components/TopBar'
import { NumberField } from '../components/NumberField'
import { formatNumber } from '../lib/format'
import { convertPriceKarat } from '../lib/tools/karatConverter'
import { gramToMithqal, mithqalToGram } from '../lib/tools/mithqalConverter'
import { amountFromWeight, weightFromAmount } from '../lib/tools/weightCalculator'
import { addPercent } from '../lib/tools/percentageCalculator'

export function ToolsPage({ onMenu }: { onMenu: () => void }) {
  const [price18, setPrice18] = useState(1000000)
  const [gram, setGram] = useState(1)
  const [mithqal, setMithqal] = useState(0)
  const [amount, setAmount] = useState(10000000)
  const [percent, setPercent] = useState(9)

  return <main className="screen">
    <TopBar title="ابزارهای طلا" onMenu={onMenu} />
    <section className="settings-card tool-card">
      <h2>تبدیل عیار</h2>
      <NumberField label="قیمت ۱۸ عیار" value={price18} onChange={setPrice18} decimals={false}/>
      <div className="tool-result">قیمت معادل ۲۴ عیار: {formatNumber(convertPriceKarat(price18,18,24))}</div>
    </section>
    <section className="settings-card tool-card">
      <h2>گرم و مثقال</h2>
      <NumberField label="گرم" value={gram} onChange={setGram}/>
      <div className="tool-result">مثقال: {formatNumber(gramToMithqal(gram))}</div>
      <NumberField label="مثقال" value={mithqal} onChange={setMithqal}/>
      <div className="tool-result">گرم: {formatNumber(mithqalToGram(mithqal))}</div>
    </section>
    <section className="settings-card tool-card">
      <h2>وزن و مبلغ</h2>
      <NumberField label="مبلغ" value={amount} onChange={setAmount} decimals={false}/>
      <div className="tool-result">وزن با قیمت فعلی: {formatNumber(weightFromAmount(amount, price18))} گرم</div>
      <div className="tool-result">ارزش ۱ گرم: {formatNumber(amountFromWeight(gram, price18))}</div>
    </section>
    <section className="settings-card tool-card">
      <h2>درصد</h2>
      <NumberField label="درصد" value={percent} onChange={setPercent}/>
      <div className="tool-result">افزایش مبلغ: {formatNumber(addPercent(amount, percent))}</div>
    </section>
  </main>
}
