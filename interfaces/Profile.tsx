import { Attribute } from "./Attribute.tsx";
import { AntidotePotion } from "./AntidotePotion.tsx";
import { HealingPotion } from "./HealingPotion.tsx";
import { EnhancerPotion } from "./EnhancerPotion.tsx";
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
    healing_potions: HealingPotion[],
    antidote_potions: AntidotePotion[],
    enhancer_potions: EnhancerPotion[],
  } 
}