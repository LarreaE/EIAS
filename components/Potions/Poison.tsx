import { Modifier } from '../../interfaces/Modifier';
import Potion from './Potion';
import { Poisons } from '../../interfaces/Poison';
class Poison extends Potion implements Poisons{

    modifiers: Modifier;

    constructor(
        props: Poisons
    ) {
        super(props._id,props.name,props.description,props.image,props.type,props.value);
        this.modifiers = props.modifiers;
    }
}

export default Poison;
