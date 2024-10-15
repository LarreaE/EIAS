import { Modifier } from "./Modifier";

export interface AntidotePotion {
	_id: string,
	name: string,
	description: string,
	image: string,
	type: string,
	value: number,
	modifiers: Modifier
}