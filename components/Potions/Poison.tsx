import { Modifier } from '../../interfaces/Modifier';

import { Poisons } from '../../interfaces/Poison';
class Poison implements Poisons {

    _id: string;
    description: string;
    image: string;
    type: string;
    name: string;
    value: number;
    modifiers: Modifier | undefined | null;

    constructor(
       props: Poisons
    ) {
        this._id = props._id;
        this.description = props.description;
        this.image = props.image;
        this.type = props.type;
        this.name = props.name;
        this.value = props.value;
        this.modifiers = props.modifiers;
    }
}

export default Poison;
