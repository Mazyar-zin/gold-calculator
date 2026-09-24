import { useState } from 'react'
import { TopBar } from '../components/TopBar'
import { NumberField } from '../components/NumberField'
import { formatNumber } from '../lib/format'

export function ToolsPage({ onMenu }: { onMenu: () => void }) {
  const [karat18, setKarat18] = useState(1000000)
  const [weight, setWeight] = useState(1)
  const [mesghal, setMesghal] = useState(0)

  const karat24 = Math.round(karat18 * (24 / 18))
  const mesghalValue = mesghal * 4.6083
  const gramValue = weight / 4.6083

  return (
    <main className="screen">
      <TopBar title="ابزارهای طلا" onMenu={onMenu} />
      <section className="settings-card tool-card">
        <h2>تبدیل عیار</h2>
        <NumberField label="قیمت ۱۸ عیار" value={karat18} onChange={setKarat18} decimals={false} />
        <div className="tool-result">قیمت ۲۴ عیار: {formatNumber(karat24)} تومان</div>
      </section>
      <section className="settings-card tool-card">
        <h2>تبدیل وزن</h2>
        <NumberField label="گرم" value={weight} onChange={setWeight} />
        <div className="tool-result">مثقال: {formatNumber(gramValue)}</div>
        <NumberField label="مثقال" value={mesghal} onChange={setMesghal} />
        <div className="tool-result">گرم: {formatNumber(mesghalValue)}</div>
      </section>
      <section className="settings-card tool-card">
        <h2>ابزار سریع</h2>
        <div className="tool-result">محاسبه درصد و اختلاف قیمت در نسخه‌های بعدی همین بخش تکمیل می‌شود.</div>
      </section>
    </main>
  )
}
