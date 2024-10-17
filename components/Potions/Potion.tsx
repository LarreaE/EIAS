import { Ingredients } from '../../interfaces/Ingredients';
import { Modifier } from '../../interfaces/Modifier';
import { Potions } from '../../interfaces/Potion';

class Potion implements Potions{

    _id!: string;
    name: string;
    description!: string;
    image!: string;
    type!: string;
    value: number;
    modifiers!: Modifier;

    constructor(
        _id: string,
        name: string,
        description: string,
        image: string,
        type: string,
        value: number ,
        modifiers: Modifier,
    ) {
        this._id = _id;
        this.description = description;
        this.image = image;
        this.type = type;
        this.modifiers = modifiers;
        this.name = name;
        this.value = value;
    }

    static create(ingredients: Ingredients[]){

        let value;
        let description;
        let image;
        let type;
        let modifiers;

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

        const potion_name = `Potion of ${ingredients[0].effects}`;
        // return new Potion();
        // console.log(potion_name);
        
    }

}

function  categorizeEffect(str: string) {

    console.log(str);
    
    const parts = str.split('_');
    let potency = '';
    let effect = '';
    let attribute = '';
    if (parts.length === 3) {
        // three parts
        potency = parts[0];
        effect = parts[1];
        attribute = parts[2];
    } else if (parts.length > 3) {
        // hit_points have broken the algorithm
        potency = parts[0];
        effect = parts[1];
        attribute = parts.slice(2).join('_'); // combine remaining parts as attribute
    } else if (parts.length === 2) {
        // no potency
        potency = 'nothing';
        effect = parts[0];
        attribute = parts[1];
    } else {
        throw new Error('Invalid string format');
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
