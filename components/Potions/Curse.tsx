import { Curses } from '../../interfaces/Curse';
import { Modifier } from '../../interfaces/Modifier';

class Curse implements Curses {
    _id!: string;
    description!: string;
    image!: string;
    name: string;
    type!: string;
    antidote_effects: string[];
    poison_effects: string[];
    modifiers: Modifier;

    constructor(
        props: Curses
    ) {
        this._id = props._id;
        this.name = props.name;
        this.type = props.type;
        this.image = props.image;
        this.description = props.description;
        this.antidote_effects = props.antidote_effects;
        this.poison_effects = props.poison_effects;
        this.modifiers = props.modifiers;
    }

    static from(curse: Curses) {
        return new Curse({
            _id: curse._id,
            name: curse.name,
            type: curse.type,
            image: curse.image,
            description: curse.description,
            antidote_effects: curse.antidote_effects,
            poison_effects: curse.poison_effects,
            modifiers: curse.modifiers,
        });
    }

    hasName(name: string) {
        return this.name === name;
    }
}

export default Curse;
