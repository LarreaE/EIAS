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

    static with(ingredients: [Ingredients]){

        let value;
        let description;
        let image;
        let type;
        let modifiers;

        let effect_magnitude;   // to save the effect strength (lesser, greater ...)
        let effect_name;        // to save the effect name (restore, increase, ...)
        let effect_attribute;   // to save what attribute is aimed to (strength, int,...)

        const potion_name = `Potion of ${ingredients[0].effects}`;
        return new Potion()
    }

}

export default Potion;
