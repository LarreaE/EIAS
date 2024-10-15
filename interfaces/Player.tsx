import { Modifier } from "./Modifier.tsx";
import { Armor } from "./Armor.tsx";
import { Weapon } from "./Weapon.tsx";
import { Jewelry } from "./Jewelry.tsx";
import { AntidotePotion } from "./AntidotePotion.tsx";
import { HealingPotion } from "./HealingPotion.tsx";
import { EnhancerPotion } from "./EnhancerPotion.tsx";
import { Profile } from "./Profile.tsx";
import { Task } from "./Task.tsx";

export interface Player{
    _id: string,
    name: String,    
    nickname: String,
    email: String,
    role: String,
    classroom_Id: String,
    level: Number,
    experience: Number,
    is_active: Boolean,
    avatar: String,
    created_date: Date,
    gold: Number,
    attributes: Modifier,
    socketId: String,
    equipment: {
      weapon: Weapon,
      armor: Armor,
      artifact: Jewelry,
      antidote_potion: AntidotePotion,
      healing_potion: HealingPotion,
      enhancer_potion: EnhancerPotion,
      helmet: Armor,
      shield: Armor,
      boot: Armor,
      ring: Jewelry
    },
    inventory: {
      helmets: Armor[],
      weapons: Weapon[],
      armors: Armor[],
      shields: Armor[],
      artifacts: Jewelry[],
      boots: Armor[],
      rings: Jewelry[],
      healing_potions: HealingPotion[],
      antidote_potions: AntidotePotion[],
      enhancer_potions: EnhancerPotion[],
    },
    profile: Profile,
    tasks: [Task]
  };