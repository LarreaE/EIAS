import { Modifier } from './Modifier.tsx';
import { Armor } from './Armor.tsx';
import { Weapon } from './Weapon.tsx';
import { Jewelry } from './Jewelry.tsx';
import { Antidotes } from './Antidote.tsx';
import { Essences } from './Essence.tsx';
import { Elixirs } from './Elixir.tsx';
import { Profile } from './Profile.tsx';
import { Task } from './Task.tsx';

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
    location: String,
    is_inside_tower:boolean,
    equipment: {
      weapon: Weapon,
      armor: Armor,
      artifact: Jewelry,
      antidote_potion: Antidotes,
      healing_potion: Essences,
      enhancer_potion: Elixirs,
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
      healing_potions: Essences[],
      antidote_potions: Antidotes[],
      enhancer_potions: Elixirs[],
    },
    profile: Profile,
    tasks: [Task]
  }
