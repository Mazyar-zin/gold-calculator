export function convertKarat(weight:number, from:number, to:number){
  if(!from || !to) return 0
  return weight * (from / to)
}

export function convertPriceKarat(price:number, from:number, to:number){
  if(!from || !to) return 0
  return Math.round(price * (to / from))
}
