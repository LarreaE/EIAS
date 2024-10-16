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

    static create(ingredients: [Ingredients]){

        let value;
        let description;
        let image;
        let type;
        let modifiers;

        let effectsArray = [];

        for (let i = 0; i < ingredients.length; i++) {
            const categorizedEffect = categorizeEffect(ingredients[i].effects);
            effectsArray.push(categorizedEffect);
        }

        checkIngredientCompatibility(effectsArray);

        const potion_name = `Potion of ${ingredients[0].effects}`;
        return new Potion();
    }

}

function  categorizeEffect(str: string) {

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
        throw new Error('Invalid string format');
    }

    return { potency, effect, attribute };
}

const potencyTiers = {
    least: 0,
    lesser: 1,
    nothing: 2,
    greater: 3,
};

function checkIngredientCompatibility(effects: Array) {

    for (let i = 0; i < effects.length; i++) {
        for (let j = i + 1; j < effects.length; j++) {
          const effect1 = effects[i];
          const effect2 = effects[j];

          if (effect1.effect === effect2.effect && effect1.attribute === effect2.attribute) {

            const lowerPotencyeffect = potencyTiers[effect1.potency] < potencyTiers[effect2.potency] ? effect1 : effect2;
            console.log(
              `Triggering action for effect: ${effect1.effect} and attribute: ${effect1.attribute}. Lower potency is: ${lowerPotencyeffect.potency}`
            );
          }
        }
    }
}
export default Potion;
