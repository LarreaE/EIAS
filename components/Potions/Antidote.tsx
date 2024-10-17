import { Modifier } from '../../interfaces/Modifier';
import Potion from './Potion';
import { Antidotes } from '../../interfaces/Antidote';
class Antidote extends Potion implements Antidotes{

    modifiers!: Modifier;

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
        this._id = _id;
        this.description = description;
        this.image = image;
        this.type = type;
        this.name = name;
        this.value = value;
        this.modifiers = modifiers;
    }
}

export default Antidote;
