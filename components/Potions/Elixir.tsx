import { Modifier } from '../../interfaces/Modifier';
import { Elixirs } from '../../interfaces/Elixir';
import EffectArray from '../../interfaces/EffectArray';
class Elixir implements Elixirs {

    _id: string;
    description: string;
    image: string;
    type: string;
    name: string;
    value: number;
    modifiers: Modifier | undefined | null;

    constructor(
       props: Elixirs
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

        let modifiers: Modifier = {
            hit_points: 0,
            intelligence: 0,
            dexterity: 0,
            insanity: 0,
            charisma: 0,
            constitution: 0,
            strength: 0,
        };

        if ( effectArray.every(element => element.attribute === effectArray[0].attribute)) {
            let attributeName = effectArray[0].attribute;
            effectArray.forEach(effect => {
                let potencyValue = 0;
                const { attribute } = effect;
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
                if (modifiers.hasOwnProperty(attribute)) {
                    modifiers[attribute as keyof Modifier] += potencyValue;
                  }
              });

              modifiers[attributeName as keyof Modifier] = round(modifiers[attributeName as keyof Modifier]); // round too newares 5
              if (attributeName === 'insanity') {
                modifiers[attributeName as keyof Modifier] = -modifiers[attributeName as keyof Modifier]; // take into account frenzy and calm
              }
              console.log('MODIFIERS OF ELIXIR: ' + modifiers);
              return modifiers;
        }
    }
}
function round(value: number): number {
    return Math.floor(value / 5) * 5;
  }

export default Elixir;
