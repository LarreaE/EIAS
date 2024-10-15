import { Modifier } from "./Modifier"

export interface Jewelry {
  _id: string,
  name: string,
  description: string,
  type: string,
  image: string,
  value: number,
  modifiers: Modifier,
  min_lvl: number,
  isUnique: boolean,
  isActive: boolean
}