import ENV from "../env.js";
import { Color } from "../services/Color.js";

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
		let time = parseInt(new Date().getHours());
		let helloArray = time > 5 ? (time < 11 ? ENV.hello.morning : time < 13 ? ENV.hello.midday : ENV.hello.evening) : ENV.hello.evening;
		let index = this.Number(helloArray.length);
		return helloArray[index] || "Hello";
	}
}
export default FRandom;
