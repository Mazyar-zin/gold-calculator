import { formatMoneyInput, normalizeDigits } from '../lib/format'

interface Props {
  label: string
  value: number
  onChange: (value: number) => void
  selectOnFocus?: boolean
}

export function MoneyField({
  label,
  value,
  onChange,
  selectOnFocus = true,
}: Props) {
  function handleChange(raw: string) {
    const normalized = normalizeDigits(raw).replace(/\./g, '')
    const numeric = Number(normalized)
    onChange(Number.isFinite(numeric) ? numeric : 0)
  }

  return (
    <label className="field money-field">
      <span className="field-label">{label}</span>
      <span className="input-shell">
        <input
          dir="ltr"
          inputMode="numeric"
          value={formatMoneyInput(value)}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={(event) => {
            if (selectOnFocus) event.currentTarget.select()
          }}
          onClick={(event) => {
            if (selectOnFocus) event.currentTarget.select()
          }}
          aria-label={label}
        />
        <span className="field-suffix">تومان</span>
      </span>
    </label>
  )
}
