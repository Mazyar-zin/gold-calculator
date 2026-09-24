import type { CalculationInput, CalculationResult } from '../types'
import { calculateGoldPrice } from './goldCalculator'

// سازگاری با صفحات فعلی برنامه
export function calculateGold(input: CalculationInput): CalculationResult {
  return calculateGoldPrice(input)
}
