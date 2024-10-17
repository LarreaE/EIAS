import { Modifier } from '../../interfaces/Modifier';
import Potion from './Potion';
import { Elixirs } from '../../interfaces/Elixir';
class Elixir extends Potion implements Elixirs {

    modifiers: Modifier;

    constructor(
        props: Elixirs
    ) {
        super(props._id,props.name,props.description,props.image,props.type,props.value);
        this.modifiers = props.modifiers;
    }
}

export default Elixir;
