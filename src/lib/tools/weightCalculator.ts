export function amountFromWeight(weight:number, price:number){
  return weight * price
}

export function weightFromAmount(amount:number, price:number){
  return price ? amount / price : 0
}
