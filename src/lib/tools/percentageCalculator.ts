export function addPercent(value:number, percent:number){
  return value + (value * percent / 100)
}

export function percentOf(value:number, percent:number){
  return value * percent / 100
}
