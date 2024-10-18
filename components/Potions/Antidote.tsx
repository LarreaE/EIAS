import { Modifier } from '../../interfaces/Modifier';
import { Antidotes } from '../../interfaces/Antidote';
import EffectArray from '../../interfaces/EffectArray';
class Antidote implements Antidotes{

    _id: string;
    description: string;
    image: string;
    type: string;
    name: string;
    value: number;
    modifiers: Modifier | undefined | null;

    constructor(
       props: Antidotes
    ) {
        this._id = props._id;
        this.description = props.description;
        this.image = props.image;
        this.type = props.type;
        this.name = props.name;
        this.value = props.value;
        this.modifiers = props.modifiers;
    }

    static calculateMod(effectArray: Array<EffectArray>) {

        let totalValue = 0;

      effectArray.forEach(effect => {
        let potencyValue = 0;

        switch (effect.potency) {
          case 'least':
            potencyValue = getRandomValue(1, 5);
            break;
          case 'lesser':
            potencyValue = getRandomValue(6, 9);
            break;
          case 'greater':
            potencyValue = getRandomValue(14, 15);
            break;
          default: // no potency or unknown
            potencyValue = getRandomValue(10, 13);
            break;
        }

        totalValue += potencyValue;
      });

      return totalValue;
    }

}
function getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Antidote;
