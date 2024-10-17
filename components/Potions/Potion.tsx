import { Ingredients } from '../../interfaces/Ingredients';
import { Potions } from '../../interfaces/Potion';
import Antidote from './Antidote';
import Elixir from './Elixir';
import Essence from './Essence';
import Poison from './Poison';
import Stench from './Stench';
import Venom from './Venom';
import { Essences } from '../../interfaces/Essence';
import Curse from './Curse';
import { Curses } from '../../interfaces/Curse';
export default class Potion implements Potions{

    _id!: string;
    name: string;
    description!: string;
    image!: string;
    type!: string;
    value: number;

    constructor(
        _id: string,
        name: string,
        description: string,
        image: string,
        type: string,
        value: number ,
    ) {
        this._id = _id;
        this.description = description;
        this.image = image;
        this.type = type;
        this.name = name;
        this.value = value;
    }

    static create(ingredients: Ingredients[] , curses: Curses[]){

        let value = calculateValue(ingredients);
        let description;
        let image = 'no images yet';
        let type = 'Potion';
        let curse = seekCurse(ingredients , curses);
        let modifiers;
        if (curse) {
            modifiers = curse.modifiers;
        }
        console.log("MODIFIERS");
        console.log(modifiers);

        let id = 'id';
        let effectsArray = [];

        for (let i = 0; i < ingredients.length; i++) {
            const categorizedEffect = categorizeEffect(ingredients[i].effects[0]);
            effectsArray.push(categorizedEffect);
        }
        const lowerPotency = checkIngredientCompatibility(effectsArray);
        description = ingredients[0].description;
        if (lowerPotency) {

        }
        let potion_name = '';

        //same effect
        if ( effectsArray.every(element => element === effectsArray[0])) {
            console.log("SAME EFFECT");
            
            switch (effectsArray[0].effect) {
                case 'increase':
                    potion_name = `Essence of ${lowerPotency} heal`;
                    console.log(potion_name);
                    type = 'Essence';
                    return new Essence({
                        _id: id,
                        name: potion_name,
                        description: description,
                        image: image,
                        type: type,
                        value: value,
                    });
                case 'decrease':
                    potion_name = `Stench of ${lowerPotency} damage`;
                    type = 'Stench';
                    console.log(potion_name);
                    return new Stench({
                        _id: id,
                        name: potion_name,
                        description: description,
                        image: image,
                        type: type,
                        value: value,
                    });
                case 'calm':
                    potion_name = `${lowerPotency} ${effectsArray[0].effect} elixir`; // calm elixir
                    console.log(potion_name);
                    type = 'Elixir';
    
                    return new Elixir({
                        _id: id,
                        name: potion_name,
                        description: description,
                        image: image,
                        type: type,
                        value: value,
                        modifiers: modifiers,
                    });
                case 'frenzy':
                    potion_name = `${lowerPotency} ${effectsArray[0].effect} venom`;
                    console.log(potion_name);
                    type = 'Venom';
    
                    return new Venom({
                        _id: id,
                        name: potion_name,
                        description: description,
                        image: image,
                        type: type,
                        value: value,
                        modifiers: modifiers,
                    });
    
                case 'boost':
                    potion_name = `${lowerPotency} ${effectsArray[0].effect} elixir`;
                    console.log(potion_name);
                    type = 'Elixir';
    
                    return new Elixir({
                        _id: id,
                        name: potion_name,
                        description: description,
                        image: image,
                        type: type,
                        value: value,
                        modifiers: modifiers,
                    });
                case 'setback':
                    potion_name = `${lowerPotency} ${effectsArray[0].attribute} venom`;
                    console.log(potion_name);
                    type = 'Venom';
    
                    return new Venom({
                        _id: id,
                        name: potion_name,
                        description: description,
                        image: image,
                        type: type,
                        value: value,
                        modifiers: modifiers,
                    });

                default:
                    break;
            }
        } else {  //not same effect (check antidotes-poison)
            console.log("NOT ther SAME EFFECT");
            
            switch (effectsArray[0].effect) {
                case 'restore':
                    potion_name = `${lowerPotency} Antidote of ${curse?.name}`;
                    console.log(potion_name);
                    type = 'Antidote';

                    return new Antidote({
                        _id: id,
                        name: potion_name,
                        description: description,
                        image: image,
                        type: type,
                        value: value,
                        modifiers: modifiers,
                    });
                case 'damage':
                    potion_name = `${lowerPotency} Poison of ${curse?.name}`;
                    console.log(potion_name);
                    type = 'Poison';

                    return new Poison({
                        _id: id,
                        name: potion_name,
                        description: description,
                        image: image,
                        type: type,
                        value: value,
                        modifiers: modifiers,
                    });
                default:
                    break;
            }
        }
    }
}
function calculateValue(ingredients: Ingredients[]) {
    let value = 0;
    for (let i = 0; i < ingredients.length; i++) {
        value += ingredients[i].value;
    }
    return value;
}
function seekCurse(ingredients: Ingredients[], curses: Curses[]) {

    const ingredientEffects = new Set<string>();
    // add ingredients
    ingredients.forEach(ingredient => {
        ingredient.effects.forEach((effect: string) => {
            ingredientEffects.add(effect);
        });
    });
    console.log("EFFECTS");
    console.log(ingredientEffects);

    // check for antidotes
    for (let i = 0; i < curses.length; i++) {

        for (const effect of curses[i].poison_effects) {
            if (ingredientEffects.has(effect)) {
                return curses[i];
            }
        }
        for (const effect of curses[i].antidote_effects) {
            if (ingredientEffects.has(effect)) {
                return curses[i];
            }
        }
    }

    return null; // no match
}
function  categorizeEffect(str: string) {

    console.log(str);
    str = str.replace('hit_points', 'hitpoints');

    const parts = str.split('_');
    let potency = '';
    let effect = '';
    let attribute = '';
    if (parts.length === 3) {
        // three parts
        potency = parts[0];
        effect = parts[1];
        attribute = parts[2];
    } else if (parts.length === 2) {
        // no potency
        potency = 'nothing';
        effect = parts[0];
        attribute = parts[1];
    } else {
        throw new Error('Invalid string format: ' + str);
    }

    return { potency, effect, attribute };
}

type Potency = 'least' | 'lesser' | 'nothing' | 'greater' | string;

const potencyTiers: Record<Potency,number> = {
    least: 0,
    lesser: 1,
    nothing: 2,
    greater: 3,
};

interface EffectArray {
    potency: Potency,
    effect: string,
    attribute: string,
}

function checkIngredientCompatibility(effects: Array<EffectArray>) {

    for (let i = 0; i < effects.length; i++) {
        for (let j = i + 1; j < effects.length; j++) {
          const effect1 = effects[i];
          const effect2 = effects[j];

            const lowerPotencyeffect = potencyTiers[effect1.potency] < potencyTiers[effect2.potency] ? effect1 : effect2;
            console.log(
              `Triggering action for effect: ${effect1.effect} and attribute: ${effect1.attribute}. Lower potency is: ${lowerPotencyeffect.potency}`
            );
            return lowerPotencyeffect.potency;
        }
    }
}