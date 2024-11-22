import { Modifier } from "./Modifier";

export default interface Item {
    modifiers: Modifier;
    _id: string;
    name: string;
    description: string;
    type: string;
    image: string;
    value: number;
    defense: number;
    min_lvl: number;
    isUnique: boolean;
    isActive: boolean;
  }