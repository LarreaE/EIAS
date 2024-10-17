import { Modifier } from '../../interfaces/Modifier';
import Potion from './Potion';
import { Venoms } from '../../interfaces/Venom';
class Venom extends Potion implements Venoms{

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

export default Venom;
