import { Color } from "../services/Color.js";
import Utils from "../services/Utils.js";
import Box from "./Box.js";

("use strict");

class GameMap extends Box {
	constructor(params) {
		super([params.width || 15, params.height || 25], params.color || Color.Blue);
		this.Node = Utils.dom;
	}
	getLine(Y) {
		let line = this.map.map(arr => {
			return arr[Y];
		});
		if (line) {
			return line;
		}
		return null;
	}

	lineIsFull(Y) {
		let isFull = false;
		let maxWidth = this.size.width;
		let activesInLine = 0;
		let mapLine = this.getLine(Y);
		if (mapLine !== null) {
			mapLine.every(item => {
				if (item.isActive()) {
					activesInLine++;
					return true;
				} else {
					return false;
				}
			});
			if (activesInLine === maxWidth) {
				isFull = true;
			}
		}
		return isFull;
	}
	clearLine(YLine) {
		if (this.getLine(YLine)) {
			let Y = YLine;
			let sourceLine = [];
			let targetLine = [];
			while (Y >= 0) {
				for (let X = 0; X < this.size.width; X++) {
					if (!this.isNull(X, Y)) {
						if (this.isNull(X, Y - 1)) {
							this.setActive(X, Y, false, this.color);
						} else {
							let sourcePoint = this.getPoint(X, Y - 1);
							this.setActive(X, Y, sourcePoint.isActive(), sourcePoint.getColor());
						}
					}
				}
				Y--;
			}
		}
	}
}

export default GameMap;
