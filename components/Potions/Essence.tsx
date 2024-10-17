import Potion from './Potion';
import { Essences } from '../../interfaces/Essence';
class Essence extends Potion implements Essences{

    constructor(
        props: Essences
    ) {
        super(props._id,props.name,props.description,props.image,props.type,props.value);
    }
}

export default Essence;
