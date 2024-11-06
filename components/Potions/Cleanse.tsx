
import EffectArray from '../../interfaces/EffectArray';
class Cleanse {

    _id: string;
    description: string;
    image: string;
    type: string;
    name: string;
    value: number;

    constructor(
       props: Cleanse
    ) {
        this._id = props._id;
        this.description = props.description;
        this.image = props.image;
        this.type = props.type;
        this.name = props.name;
        this.value = props.value;
    }
   
    static name(potency: string | undefined) {
      if (potency === '') {
        return 'Purification Potion';
      } else {
        return `Purification Potion`;
      }
    }

    static purify() {
        
    }
}

export default Cleanse;
