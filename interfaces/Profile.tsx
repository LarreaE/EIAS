import { Attribute } from "./Attribute.tsx";
import { Antidote } from "./Antidote.tsx";
import { Essence } from "./Essence.tsx";
import { Elixir } from "./Elixir.tsx";
import { Armor } from "./Armor.tsx";
import { Weapon } from "./Weapon.tsx";
import { Jewelry } from "./Jewelry.tsx";

export interface Profile {
  _id: string;
  name: string;
  image: string;
  description: string;
  attributes: Attribute[];
  equipment:{
    armors: Armor[],
    weapons: Weapon[],
    artifacts: Jewelry[],
    healing_potions: Essence[],
    antidote_potions: Antidote[],
    enhancer_potions: Elixir[],
  } 
}