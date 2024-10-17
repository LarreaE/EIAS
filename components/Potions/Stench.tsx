import Potion from './Potion';
import { Stenches } from '../../interfaces/Stench';
class Stench extends Potion implements Stenches{

    constructor(
        props: Stenches
    ) {
        super(props._id,props.name,props.description,props.image,props.type,props.value);
    }
}

export default Stench;
