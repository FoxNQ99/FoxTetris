import { Color } from "../Models/Color.js";

("use strict");

class FRandom {
	constructor() {}
	static Number = max => {
		max -= 1;
		return Math.floor(Math.random() * max);
	};
	static Color = () => {
		let Colors = Object.values(Color);
		let num = this.Number(Colors.length);
		return Colors[num];
	};
}
export default FRandom;
