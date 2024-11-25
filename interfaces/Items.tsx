// General Modifiers Interface
export interface Modifiers {
    intelligence: number;
    dexterity: number;
    constitution: number;
    insanity: number;
    charisma: number;
    strength: number;
    hit_points?: number; // Only present for specific items like healing potions
  }
  
  // Base Equipment Interface
  export interface BaseEquipment {
    _id: string;
    name: string;
    description: string;
    type: string;
    image: string;
    value: number;
    min_lvl: number;
    modifiers: Modifiers;
  }
  
  // Weapon Interface
  export interface Weapon extends BaseEquipment {
    base_percentage: number;
    die_faces: number;
    die_modifier: number;
    die_num: number;
  }
  
  // Armor Interface
  export interface Armor extends BaseEquipment {
    defense: number;
    isUnique: boolean;
    isActive: boolean;
  }
  
  // Artifact Interface
  export interface Artifact extends BaseEquipment {}
  
  // Potion Recovery Effect Interface
  export interface RecoveryEffect {
    modifiers: Modifiers;
    _id: string;
    name: string;
    description: string;
    type: string;
    antidote_effects: string[];
    poison_effects: string[];
  }
  
  // Potion Interface
  export interface Potion extends BaseEquipment {
    recovery_effect?: RecoveryEffect; // Present for antidote potions
    duration?: number; // Present for enhancer potions
  }
  
  // Shield Interface
  export interface Shield extends BaseEquipment {
    defense: number;
    isUnique: boolean;
    isActive: boolean;
  }
  
  // Helmet Interface
  export interface Helmet extends BaseEquipment {
    defense: number;
    isUnique: boolean;
    isActive: boolean;
  }
  
  // Boot Interface
  export interface Boot extends BaseEquipment {
    defense: number;
    isUnique: boolean;
    isActive: boolean;
  }
  
  // Ring Interface
  export interface Ring extends BaseEquipment {
    isUnique: boolean;
    isActive: boolean;
  }
  
  // Main Object Interface
  export interface Equipment {
    weapon: Weapon;
    armor: Armor;
    artifact: Artifact;
    antidote_potion: Potion;
    healing_potion: Potion;
    enhancer_potion: Potion;
    helmet: Helmet;
    shield: Shield;
    boot: Boot;
    ring: Ring;
  }
  