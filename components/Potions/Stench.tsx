
import { Stenches } from '../../interfaces/Stench';
import EffectArray from '../../interfaces/EffectArray';
class Stench implements Stenches{

    _id: string;
    description: string;
    image: string;
    type: string;
    name: string;
    value: number;
    damage: number;

    constructor(
       props: Stenches
    ) {
        this._id = props._id;
        this.description = props.description;
        this.image = props.image;
        this.type = props.type;
        this.name = props.name;
        this.value = props.value;
        this.damage = props.damage;
    }
    static calculateMod(effectArray: Array<EffectArray>) {

        let damageValue = 0;

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
                damageValue += potencyValue;
              });
              if (effectArray.every(element => element.potency === effectArray[0].potency && effectArray.length === 2)) {
                damageValue = damageValue * 1.2; // +20%
              } else if (effectArray.every(element => element.potency === effectArray[0].potency && effectArray.length === 3)) {
                damageValue = damageValue * 1.4; // +40%
              } else if (effectArray.every(element => element.potency === effectArray[0].potency && effectArray.length === 4)) {
                damageValue = damageValue * 1.8; // +80%
              }

              damageValue = Math.ceil(damageValue);
              console.log("MODIFIERS OF STENCH: " + damageValue);
              return -damageValue;
    }
    static name(potency: string | undefined) {
      if (potency === '') {
        return 'Stench of damage';
      } else {
        return `Stench of ${potency} damage`;
      }
    }
}

export default Stench;
