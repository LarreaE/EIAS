import { Modifier } from "./Modifier";

export interface Curses {
    _id: string,
	name: string,
	description: string,
	image: string,
	type: string,
	antidote_effects: string[],
	poison_effects: string[],
	modifiers: Modifier
}