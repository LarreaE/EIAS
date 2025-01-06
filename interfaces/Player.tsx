import { Modifier } from './Modifier.tsx';
import { Armor } from './Armor.tsx';
import { Weapon } from './Weapon.tsx';
import { Jewelry } from './Jewelry.tsx';
import { Antidotes } from './Antidote.tsx';
import { Essences } from './Essence.tsx';
import { Elixirs } from './Elixir.tsx';
import { Profile } from './Profile.tsx';
import { Task } from './Task.tsx';

export interface Player {
  _id: string;
  name: string;
  nickname: string;
  email: string;
  role: string;
  classroom_Id: string;
  level: number;
  experience: number;
  is_active: boolean;
  avatar: string;
  created_date: Date;
  gold: number;
  attributes: Modifier;
  socketId: string;
  location: string;
  is_inside_tower: boolean;
  ArtifactsValidated: boolean;
  AngeloReduced: boolean;
  resistance: number;
  disease: 'PUTRID PLAGUE' | 'EPIC WEAKNESS' | 'MEDULAR APOCALYPSE' | null;
  ethaziumCursed: boolean;
  appLockedReason?: 'DISEASE' | 'ETHAZIUM_CURSE' | null;

  equipment: {
    weapon: Weapon;
    armor: Armor;
    artifact: Jewelry;
    antidote_potion: Antidotes;
    healing_potion: Essences;
    enhancer_potion: Elixirs;
    helmet: Armor;
    shield: Armor;
    boot: Armor;
    ring: Jewelry;
  };
  inventory: {
    helmets: Armor[];
    weapons: Weapon[];
    armors: Armor[];
    shields: Armor[];
    artifacts: Jewelry[];
    boots: Armor[];
    rings: Jewelry[];
    healing_potions: Essences[];
    antidote_potions: Antidotes[];
    enhancer_potions: Elixirs[];
  };
  profile: Profile;
  tasks: Task[];
}
