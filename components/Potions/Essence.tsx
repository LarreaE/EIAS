
import { Essences } from '../../interfaces/Essence';
class Essence {

    _id: string;
    description: string;
    image: string;
    type: string;
    name: string;
    value: number;

    constructor(
       props: Essences
    ) {
        this._id = props._id;
        this.description = props.description;
        this.image = props.image;
        this.type = props.type;
        this.name = props.name;
        this.value = props.value;
    }
}

export default Essence;
