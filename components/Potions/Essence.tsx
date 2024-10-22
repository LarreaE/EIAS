
import { Essences } from '../../interfaces/Essence';
import EffectArray from '../../interfaces/EffectArray';
class Essence {

    _id: string;
    description: string;
    image: string;
    type: string;
    name: string;
    value: number;
    heal: number;

    constructor(
       props: Essences
    ) {
        this._id = props._id;
        this.description = props.description;
        this.image = props.image;
        this.type = props.type;
        this.name = props.name;
        this.value = props.value;
        this.heal = props.heal;
    }
    static calculateMod(effectArray: Array<EffectArray>) {

        let healValue = 0;

            effectArray.forEach(effect => {
                let potencyValue = 0;
                switch (effect.potency) {
                  case 'least':
                    potencyValue = 5;
                    break;
                  case 'lesser':
                    potencyValue = 10;
                    break;
                  case 'greater':
                    potencyValue = 20;
                    break;
                  default: // no potency or unknown
                    potencyValue = 15;
                    break;
                }
                healValue += potencyValue;
              });
              if (effectArray.every(element => element.potency === effectArray[0].potency && effectArray.length === 2)) {
                healValue = healValue * 1.2; // +20%
              } else if (effectArray.every(element => element.potency === effectArray[0].potency && effectArray.length === 3)) {
                healValue = healValue * 1.4; // +40%
              } else if (effectArray.every(element => element.potency === effectArray[0].potency && effectArray.length === 2)) {
                healValue = healValue * 1.8; // +80%
              }
              healValue = Math.ceil(healValue);
              console.log('MODIFIERS OF ESSENCE: ' + healValue);
              return healValue;
    }

    static name(potency: string | undefined) {
      if (potency === '') {
        return 'Essence of heal';
      } else {
        return `Essence of ${potency} heal`;
      }
    }
}

export default Essence;
