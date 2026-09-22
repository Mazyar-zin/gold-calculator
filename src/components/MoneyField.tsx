import { formatMoneyInput, normalizeDigits } from '../lib/format'

interface Props {
  label: string
  value: number
  onChange: (value: number) => void
  compact?: boolean
}

export function MoneyField({ label, value, onChange, compact = false }: Props) {
  function handleChange(raw: string) {
    const normalized = normalizeDigits(raw).replace(/\./g, '')
    const numeric = Number(normalized)
    onChange(Number.isFinite(numeric) ? numeric : 0)
  }

  return (
    <label className={compact ? 'field compact-field money-field' : 'field money-field'}>
      <span className="field-label">{label}</span>
      <span className="input-shell">
        <input
          dir="ltr"
          inputMode="numeric"
          value={formatMoneyInput(value)}
          onChange={(event) => handleChange(event.target.value)}
          aria-label={label}
        />
        <span className="field-suffix">تومان</span>
      </span>
    </label>
  )
}
