export const MITHQAL_GRAM = 4.6083

export function gramToMithqal(gram:number){
  return gram / MITHQAL_GRAM
}

export function mithqalToGram(mithqal:number){
  return mithqal * MITHQAL_GRAM
}
