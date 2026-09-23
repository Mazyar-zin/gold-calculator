import { useEffect, useState } from 'react'
import { TopBar } from '../components/TopBar'

type Operator = '+' | '-' | '*' | '/'

const operatorLabel: Record<Operator, string> = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
}

function calculate(left: number, right: number, operator: Operator) {
  let value = 0

  if (operator === '+') value = left + right
  if (operator === '-') value = left - right
  if (operator === '*') value = left * right
  if (operator === '/') {
    if (right === 0) return null
    value = left / right
  }

  if (!Number.isFinite(value)) return null
  return Number(value.toPrecision(12))
}

function localize(value: string) {
  if (value === 'خطا') return value

  const digitMap: Record<string, string> = {
    '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
    '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹',
  }

  if (/e/i.test(value)) {
    return value
      .replace('-', '−')
      .replace('.', '٫')
      .replace(/[0-9]/g, (digit) => digitMap[digit])
  }

  const negative = value.startsWith('-')
  const unsigned = negative ? value.slice(1) : value
  const [integer = '0', decimal] = unsigned.split('.')
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '٬')
  const rendered = decimal !== undefined ? `${grouped}٫${decimal}` : grouped
  const translated = rendered.replace(/[0-9]/g, (digit) => digitMap[digit])
  return negative ? `−${translated}` : translated
}

export function GeneralCalculatorPage({ onMenu }: { onMenu: () => void }) {
  const [display, setDisplay] = useState('0')
  const [accumulator, setAccumulator] = useState<number | null>(null)
  const [operator, setOperator] = useState<Operator | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [expression, setExpression] = useState('')
  const [memory, setMemory] = useState(0)
  const [deleteTimer, setDeleteTimer] = useState<number | null>(null)

  function currentValue() {
    const value = Number(display)
    return Number.isFinite(value) ? value : 0
  }

  function reset() {
    setDisplay('0')
    setAccumulator(null)
    setOperator(null)
    setWaitingForOperand(false)
    setExpression('')
  }

  function inputDigit(digit: string) {
    if (display === 'خطا' || waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
      return
    }

    const digitCount = display.replace(/[-.]/g, '').length
    if (digitCount >= 14) return
    setDisplay(display === '0' ? digit : display + digit)
  }

  function inputDecimal() {
    if (display === 'خطا' || waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }

    if (!display.includes('.')) setDisplay(`${display}.`)
  }

  function chooseOperator(nextOperator: Operator) {
    if (display === 'خطا') {
      reset()
      return
    }

    const input = currentValue()
    let nextAccumulator = accumulator

    if (nextAccumulator === null) {
      nextAccumulator = input
    } else if (operator && !waitingForOperand) {
      const result = calculate(nextAccumulator, input, operator)
      if (result === null) {
        setDisplay('خطا')
        setAccumulator(null)
        setOperator(null)
        setWaitingForOperand(true)
        setExpression('تقسیم بر صفر مجاز نیست')
        return
      }
      nextAccumulator = result
      setDisplay(String(result))
    }

    setAccumulator(nextAccumulator)
    setOperator(nextOperator)
    setWaitingForOperand(true)
    setExpression(`${localize(String(nextAccumulator))} ${operatorLabel[nextOperator]}`)
  }

  function equals() {
    if (!operator || accumulator === null || display === 'خطا') return

    const input = currentValue()
    const result = calculate(accumulator, input, operator)

    if (result === null) {
      setDisplay('خطا')
      setExpression('تقسیم بر صفر مجاز نیست')
    } else {
      setExpression(
        `${localize(String(accumulator))} ${operatorLabel[operator]} ${localize(display)} =`,
      )
      setDisplay(String(result))
    }

    setAccumulator(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  function backspace() {
    if (display === 'خطا' || waitingForOperand) return
    if (display.length <= 1 || (display.startsWith('-') && display.length === 2)) {
      setDisplay('0')
      return
    }
    setDisplay(display.slice(0, -1))
  }

  function startDelete() {
    backspace()
    const id = window.setInterval(() => backspace(), 90)
    setDeleteTimer(id)
  }

  function stopDelete() {
    if (deleteTimer) {
      window.clearInterval(deleteTimer)
      setDeleteTimer(null)
    }
  }

  function toggleSign() {
    if (display === '0' || display === 'خطا') return
    setDisplay(display.startsWith('-') ? display.slice(1) : `-${display}`)
  }

  function percent() {
    if (display === 'خطا') return
    setDisplay(String(Number((currentValue() / 100).toPrecision(12))))
  }

  function memoryRecall() {
    setDisplay(String(memory))
    setWaitingForOperand(false)
  }

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (/^[0-9]$/.test(event.key)) inputDigit(event.key)
      else if (event.key === '.' || event.key === ',') inputDecimal()
      else if (event.key === '+') chooseOperator('+')
      else if (event.key === '-') chooseOperator('-')
      else if (event.key === '*') chooseOperator('*')
      else if (event.key === '/') chooseOperator('/')
      else if (event.key === '%') percent()
      else if (event.key === 'Enter' || event.key === '=') equals()
      else if (event.key === 'Backspace') backspace()
      else if (event.key === 'Escape') reset()
      else return

      event.preventDefault()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  return (
    <main className="screen">
      <TopBar title="ماشین حساب" onMenu={onMenu} />

      <section className="utility-calculator" aria-label="ماشین حساب">
        <div className="calculator-display" aria-live="polite">
          <span className="calculator-expression">
            {expression || (memory !== 0 ? 'M' : '')}
          </span>
          <strong dir="ltr">{localize(display)}</strong>
        </div>

        <div className="memory-row" aria-label="حافظه ماشین حساب">
          <button type="button" onClick={() => setMemory(0)}>MC</button>
          <button type="button" onClick={memoryRecall}>MR</button>
          <button type="button" onClick={() => setMemory(memory + currentValue())}>M+</button>
          <button type="button" onClick={() => setMemory(memory - currentValue())}>M−</button>
        </div>

        <div className="calculator-grid">
          <button className="calc-key utility" type="button" onClick={reset}>C</button>
          <button className="calc-key utility" type="button" onMouseDown={startDelete} onMouseUp={stopDelete} onMouseLeave={stopDelete} onTouchStart={startDelete} onTouchEnd={stopDelete}>⌫</button>
          <button className="calc-key utility" type="button" onClick={percent}>%</button>
          <button className="calc-key operator" type="button" onClick={() => chooseOperator('/')}>÷</button>

          <button className="calc-key number" type="button" onClick={() => inputDigit('7')}>۷</button>
          <button className="calc-key number" type="button" onClick={() => inputDigit('8')}>۸</button>
          <button className="calc-key number" type="button" onClick={() => inputDigit('9')}>۹</button>
          <button className="calc-key operator" type="button" onClick={() => chooseOperator('*')}>×</button>

          <button className="calc-key number" type="button" onClick={() => inputDigit('4')}>۴</button>
          <button className="calc-key number" type="button" onClick={() => inputDigit('5')}>۵</button>
          <button className="calc-key number" type="button" onClick={() => inputDigit('6')}>۶</button>
          <button className="calc-key operator" type="button" onClick={() => chooseOperator('-')}>−</button>

          <button className="calc-key number" type="button" onClick={() => inputDigit('1')}>۱</button>
          <button className="calc-key number" type="button" onClick={() => inputDigit('2')}>۲</button>
          <button className="calc-key number" type="button" onClick={() => inputDigit('3')}>۳</button>
          <button className="calc-key operator" type="button" onClick={() => chooseOperator('+')}>+</button>

          <button className="calc-key utility" type="button" onClick={toggleSign}>±</button>
          <button className="calc-key number" type="button" onClick={() => inputDigit('0')}>۰</button>
          <button className="calc-key number" type="button" onClick={inputDecimal}>٫</button>
          <button className="calc-key operator equals" type="button" onClick={equals}>=</button>
        </div>
      </section>
    </main>
  )
}
