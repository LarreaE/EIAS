import { Ingredients } from '../../interfaces/Ingredients';

class Ingredient implements Ingredients {
    _id!: string;
    description!: string;
    effects: string[];
    image!: string;
    name: string;
    type!: string;
    value: number;

    constructor(
        _id: string,
        name: string,
        effects: string[],
        value: number,
        type: string,
        image: string,
        description: string
    ) {
        this._id = _id;
        this.name = name;
        this.effects = effects;
        this.type = type;
        this.image = image;
        this.description = description;
        this.value = value;
    }

    static from(ingredient: Ingredients) {
        return new Ingredient(
            ingredient._id,
            ingredient.name,
            ingredient.effects,
            ingredient.value,
            ingredient.type,
            ingredient.image,
            ingredient.description,
        );
    }

    hasName(name: string) {
        return this.name === name;
    }
}

export default Ingredient;
