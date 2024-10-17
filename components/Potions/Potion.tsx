import { Ingredients } from '../../interfaces/Ingredients';
import { Modifier } from '../../interfaces/Modifier';
import { Potions } from '../../interfaces/Potion';
import Antidote from './Antidote';
import Elixir from './Elixir';
import Essence from './Essence';
import Poison from './Poison';
import Stench from './Stench';
import Venom from './Venom';

class Potion implements Potions{

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

    static create(ingredients: Ingredients[]){

        let value = calculateValue(ingredients);
        let description;
        let image = 'no images yet';
        let type = 'Potion';
        let modifiers = calculateModifiers(ingredients);
        let id = 'id';
        let effectsArray = [];

        console.log("Ingreds");
        console.log(ingredients);
        for (let i = 0; i < ingredients.length; i++) {
            const categorizedEffect = categorizeEffect(ingredients[i].effects[0]);
            effectsArray.push(categorizedEffect);
        }
        console.log(effectsArray);
        const lowerPotency = checkIngredientCompatibility(effectsArray);
        console.log(lowerPotency);
        description = ingredients[0].description;

        let potion_name = '';
        switch (effectsArray[0].effect) {
            case 'increase':
                potion_name = `Essence of ${lowerPotency} heal`;
                console.log(potion_name);
                return new Essence(id, potion_name, description, image, type , value , modifiers);
            case 'decrease':
                potion_name = `Stench of ${lowerPotency} damage`;
                console.log(potion_name);
                return new Stench(id, potion_name, description, image, type , value , modifiers);
            case 'calm':
                potion_name = `${lowerPotency} ${effectsArray[0].effect} elixir`; // calm elixir
                console.log(potion_name);
                return new Elixir(id, potion_name, description, image, type , value , modifiers);
            case 'frenzy':
                potion_name = `${lowerPotency} ${effectsArray[0].effect} venom`;
                console.log(potion_name);
                return new Venom(id, potion_name, description, image, type , value , modifiers);
            case 'boost':
                potion_name = `${lowerPotency} ${effectsArray[0].effect} elixir`;
                console.log(potion_name);
                return new Elixir(id, potion_name, description, image, type , value , modifiers);
            case 'setback':
                potion_name = `${lowerPotency} ${effectsArray[0].attribute} venom`;
                console.log(potion_name);
                return new Venom(id, potion_name, description, image, type , value , modifiers);
            case 'restore':
                potion_name = `${lowerPotency} Antidote of "CURSE"`;
                console.log(potion_name);
                return new Antidote(id, potion_name, description, image, type , value , modifiers);
            case 'damage':
                potion_name = `${lowerPotency} Poison of "CURSE"`;
                console.log(potion_name);
                return new Poison(id, potion_name, description, image, type , value , modifiers);

            default:
                break;
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
function calculateModifiers(ingredients: Ingredients[]) {
    let mods = 0;
    for (let i = 0; i < ingredients.length; i++) {
    }
    return mods;
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

          if (effect1.effect === effect2.effect && effect1.attribute === effect2.attribute) {

            const lowerPotencyeffect = potencyTiers[effect1.potency] < potencyTiers[effect2.potency] ? effect1 : effect2;
            console.log(
              `Triggering action for effect: ${effect1.effect} and attribute: ${effect1.attribute}. Lower potency is: ${lowerPotencyeffect.potency}`
            );
            return lowerPotencyeffect.potency;
          }
        }
    }
}
export default Potion;
