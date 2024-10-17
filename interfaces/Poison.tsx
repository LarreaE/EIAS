import { Modifier } from "./Modifier";

export interface Poisons {
    _id: string,
	name: string,
	description: string,
	image: string,
	type: string,
	value: number,
	modifiers: Modifier | undefined | null
}