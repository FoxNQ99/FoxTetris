"use strict";

class Point {
	constructor(X, Y, isOn = false, color = "white") {
		this.position = {
			X,
			Y,
		};
		this.isOn = isOn;
		this.color = color;
	}

	setPosition(X, Y) {
		this.position = { X, Y };
	}

	setActive(isActive = true) {
		this.isOn = isActive;
	}

	getPosition() {
		return this.position;
	}
	setColor(color) {
		this.color = color;
	}
	getColor() {
		return this.color;
	}
	isActive() {
		return this.isOn;
	}
}
export default Point;
