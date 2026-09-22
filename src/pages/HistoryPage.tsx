import type { HistoryItem } from '../types'
import { formatToman } from '../lib/format'
import { Icon } from '../components/Icon'
import { TopBar } from '../components/TopBar'

interface Props {
  history: HistoryItem[]
  onClear: () => void
  onMenu: () => void
}

export function HistoryPage({ history, onClear, onMenu }: Props) {
  return (
    <main className="screen">
      <TopBar
        title="تاریخچه"
        onMenu={onMenu}
        action={
          history.length > 0 ? (
            <button className="icon-button danger" type="button" onClick={onClear} aria-label="پاک کردن تاریخچه">
              <Icon name="trash" size={19} />
            </button>
          ) : undefined
        }
      />

      {history.length === 0 ? (
        <section className="empty-state">
          <div className="empty-icon"><Icon name="history" size={28} /></div>
          <h2>هنوز محاسبه‌ای ذخیره نشده</h2>
          <p>نتیجه‌های مورد نیازت را از صفحه محاسبه ذخیره کن.</p>
        </section>
      ) : (
        <section className="history-list">
          {history.map((item) => {
            const date = new Date(item.createdAt)
            return (
              <article className="history-card" key={item.id}>
                <div className="history-card-head">
                  <div>
                    <strong>{item.input.weight.toLocaleString('fa-IR')} گرم</strong>
                    <span>{date.toLocaleDateString('fa-IR')}، {date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <span className="mini-badge">{item.input.karat.toLocaleString('fa-IR')} عیار</span>
                </div>

                <div className="history-total">
                  <strong>{formatToman(item.result.total)}</strong>
                </div>

                <div className="history-meta">
                  <span>اجرت {item.input.wagePercent.toLocaleString('fa-IR')}٪</span>
                  <span>سود {item.input.profitPercent.toLocaleString('fa-IR')}٪</span>
                  <span>مالیات {item.input.taxPercent.toLocaleString('fa-IR')}٪</span>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}
