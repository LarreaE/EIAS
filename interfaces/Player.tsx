import { Modifier } from "./Modifier.tsx";
import { Armor } from "./Armor.tsx";
import { Weapon } from "./Weapon.tsx";
import { Jewelry } from "./Jewelry.tsx";
import { Antidote } from "./Antidote.tsx";
import { Essence } from "./Essence.tsx";
import { Elixir } from "./Elixir.tsx";
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
      antidote_potion: Antidote,
      healing_potion: Essence,
      enhancer_potion: Elixir,
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
      healing_potions: Essence[],
      antidote_potions: Antidote[],
      enhancer_potions: Elixir[],
    },
    profile: Profile,
    tasks: [Task]
  };