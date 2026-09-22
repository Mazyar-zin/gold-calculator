import type { CalculationInput, CalculationResult } from '../types'

export function calculateGold(input: CalculationInput): CalculationResult {
  const rawPrice = input.weight * input.gramPrice
  const wage = rawPrice * (input.wagePercent / 100)
  const profit = (rawPrice + wage) * (input.profitPercent / 100)
  const tax = (wage + profit) * (input.taxPercent / 100)
  const total = rawPrice + wage + profit + tax

  return {
    rawPrice: Math.round(rawPrice),
    wage: Math.round(wage),
    profit: Math.round(profit),
    tax: Math.round(tax),
    total: Math.round(total),
  }
}
