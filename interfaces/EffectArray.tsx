
export default interface EffectArray {
    attribute: string;
    effect: string;
    potency: 'least' | 'lesser' | 'greater' | '' // '' represents no potency value
}
