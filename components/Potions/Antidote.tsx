import { Modifier } from '../../interfaces/Modifier';
import { Antidotes } from '../../interfaces/Antidote';
class Antidote implements Antidotes{

    _id: string;
    description: string;
    image: string;
    type: string;
    name: string;
    value: number;
    modifiers: Modifier;

    constructor(
       props: Antidotes
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

export default Antidote;
