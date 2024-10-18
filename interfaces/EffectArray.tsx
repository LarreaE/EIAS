
export default interface EffectArray {
    attribute: string;
    effect: string;
    potency: 'least' | 'lesser' | 'greater' | '' | string // '' represents no potency value
}
