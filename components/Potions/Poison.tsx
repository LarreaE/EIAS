import { Modifier } from '../../interfaces/Modifier';
import Potion from './Potion';
import { Poisons } from '../../interfaces/Poison';
class Poison extends Potion implements Poisons{

    modifiers: Modifier;

    constructor(
        _id: string,
        name: string,
        description: string,
        image: string,
        type: string,
        value: number ,
        modifiers: Modifier,
    ) {
        super(_id,name,description,image,type,value);
        this.modifiers = modifiers;
    }
}

export default Poison;
