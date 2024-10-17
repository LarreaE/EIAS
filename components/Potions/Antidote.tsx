import { Modifier } from '../../interfaces/Modifier';
import Potion from './Potion';
import { Antidotes } from '../../interfaces/Antidote';
class Antidote extends Potion implements Antidotes{

    modifiers!: Modifier;

    constructor(
       props: Antidotes
    ) {
        super(props._id,props.name,props.description,props.image,props.type,props.value);
        this.modifiers = props.modifiers;
    }
}

export default Antidote;
