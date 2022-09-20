import ENV from "../configs/env.js";
import { Color } from "./Color.js";

("use strict");

class FRandom {
	constructor() {}
	static Number(max) {
		max -= 1;
		return Math.floor(Math.random() * max);
	}
	static Color() {
		let Colors = Object.values(Color);
		let num = this.Number(Colors.length);
		return Colors[num];
	}
	static PickRandomHello() {
		let helloArray = ENV.hello;
		let index = this.Number(helloArray.length);
		return helloArray[index] || "Hello";
	}
}
export default FRandom;
