import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { normalizeDigits, parseNumber } from '../lib/format'

interface Props {
  label: string
  value: number
  onChange: (value: number) => void
  suffix?: ReactNode
  hint?: string
  decimals?: boolean
  compact?: boolean
}

export function NumberField({
  label,
  value,
  onChange,
  suffix,
  hint,
  decimals = true,
  compact = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [text, setText] = useState(value === 0 ? '' : String(value))

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setText(value === 0 ? '' : String(value))
    }
  }, [value])

  function handleChange(raw: string) {
    let normalized = normalizeDigits(raw)
    if (!decimals) normalized = normalized.replace(/\./g, '')
    setText(normalized)
    onChange(parseNumber(normalized))
  }

  function handleBlur() {
    setText(value === 0 ? '' : String(value))
  }

  return (
    <label className={compact ? 'field compact-field' : 'field'}>
      <span className="field-label">{label}</span>
      <span className="input-shell">
        <input
          ref={inputRef}
          inputMode={decimals ? 'decimal' : 'numeric'}
          value={text}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={handleBlur}
          aria-label={label}
        />
        {suffix && <span className="field-suffix">{suffix}</span>}
      </span>
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}
