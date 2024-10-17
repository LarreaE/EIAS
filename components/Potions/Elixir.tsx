import { Modifier } from '../../interfaces/Modifier';
import { Elixirs } from '../../interfaces/Elixir';
class Elixir implements Elixirs {

    _id: string;
    description: string;
    image: string;
    type: string;
    name: string;
    value: number;
    modifiers: Modifier | undefined | null;

    constructor(
       props: Elixirs
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

export default Elixir;
