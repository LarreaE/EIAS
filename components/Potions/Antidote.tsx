import { Modifier } from '../../interfaces/Modifier';
import Potion from './Potion';

class Antidote extends Potion{

    constructor(
        _id: string,
        name: string,
        description: string,
        image: string,
        type: string,
        value: number ,
        modifiers: Modifier,
    ) {
        super(_id,name,description,image,type,value,modifiers);
    }
}

export default Antidote;
