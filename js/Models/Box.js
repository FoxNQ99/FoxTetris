import CusErr from "../services/CustomERR.js";
import Point from "./Point.js";

("use strict");

class Box {
	constructor(size, color) {
		this.setSize(size);
		this.color = color;
		this.map = this.initializePoints();

		//TestZone
	}
	setSize(size) {
		if (Array.isArray(size)) {
			this.size = {
				width: parseInt(size[0]) || 0,
				height: parseInt(size[1]) || 0,
			};
		} else if (parseInt(size) && parseInt(size) > 0) {
			this.size = {
				width: parseInt(size) || 0,
				height: parseInt(size) || 0,
			};
		} else {
			CusErr.Show(`Size is undefined or less than 0 (size = ${size})`);
		}
	}
	initializePoints() {
		let self = this;
		let map = [];
		let height = this.size.height;
		let width = this.size.width;
		for (let Y = 0; Y < height; Y++) {
			for (let X = 0; X < width; X++) {
				if (!map[X]) {
					map[X] = new Array();
				}
				map[X][Y] = new Point(X, Y, false, this.color);
			}
		}
		return map;
	}
	getPoint(X, Y) {
		return this.map[X]?.[Y] || undefined;
	}
	isNull(X, Y) {
		return this.getPoint(X, Y) ? false : true;
	}

	isActive(X, Y) {
		return this.getPoint(X, Y)?.isActive() || false;
	}
	setActive(X, Y, isActive) {
		if (!this.isNull(X, Y)) {
			this.map[X][Y].setActive(isActive);
		}
	}
	isArray2D(arr2D) {
		return (arr2D.length > 0 && arr2D[0].length > 0) || false;
	}
	//debugZone
	ShowMapDebug() {
		console.table(
			this.map.map(arr => {
				return arr.map(item => {
					let position = item.getPosition();
					return { X: position.X, Y: position.Y, isOn: item.isActive() };
				});
			}),
		);
	}
}
export default Box;
