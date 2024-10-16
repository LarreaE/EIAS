import { Modifier } from "./Modifier";

export interface Stench {
    _id: string,
	name: string,
	description: string,
	image: string,
	type: string,
	value: number,
	modifiers: Modifier
}