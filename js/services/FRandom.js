import { EContent } from "../configs/env.js";
import TetrisBox from "../Models/TetrisBoxs.js";
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
		let helloArray = EContent.hello;
		let index = this.Number(helloArray.length);
		return helloArray[index] || "Hello";
	}
	static PickRandomBox() {
		let Boxs = Object.values(TetrisBox);
		let Colors = Object.values(Color);
		let indexBox = this.Number(Boxs.length);
		let indexColor = this.Number(Colors.length);
		let selectBox = new Boxs[indexBox](Colors[indexColor]);
		let rotateTime = this.Number(3);
		for (let i = 0; i < rotateTime; i++) {
			selectBox.updateActivePoints(selectBox.rotate());
		}
		return selectBox;
	}
}
export default FRandom;
