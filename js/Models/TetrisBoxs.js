import Box from "./Box.js";
import Point from "./Point.js";

("use strict");

class TetrisBase extends Box {
	constructor(size, color) {
		super(size, color);
		this.MapPosition = {
			X: 0,
			Y: 0,
		};
		this.tmpMapPosition = {
			X: 0,
			Y: 0,
		};
	}
	getRealPoint(X, Y) {
		let realX = X - this.MapPosition.X;
		let realY = Y - this.MapPosition.Y;
		return { X: realX, Y: realY };
	}
	getPoint(X, Y) {
		return this.getRealPoint(X, Y);
	}
	getActivePointsOnMap(arr2D, mapPosition) {
		let self = this;
		let activePoints = [];
		if (this.isArray2D(arr2D)) {
			arr2D.map(arr =>
				arr.map(item => {
					if (item.isActive()) {
						let position = item.getPosition();
						let XMap = position.X + mapPosition.X;
						let YMap = position.Y + mapPosition.Y;
						let modifierPoint = new Point(XMap, YMap, true, self.color);
						activePoints.push(modifierPoint);
					}
				}),
			);
		}
		return activePoints;
	}
	getActivePoints() {
		return this.getActivePointsOnMap(this.map, this.MapPosition);
	}
	isNull(X, Y) {
		return this.getPoint(X, Y) ? false : true;
	}
	isActive(X, Y) {
		return this.getPoint(X, Y)?.isActive() || false;
	}
	setActive(X, Y, isActive) {
		if (!this.isNull(X, Y)) {
			let realPoint = this.getRealPoint(X, Y);
			super.setActive(realPoint.X, realPoint.Y, isActive);
		}
	}
	extendsActivePoints(points) {
		if (this.isArray2D(points)) {
			for (let Y = 0; Y < points.length; Y++) {
				for (let X = 0; X < points[Y].length; X++) {
					points[X][Y] ? this.setActive(X, Y, true) : 0;
				}
			}
		}
	}
	rotate() {
		let length = this.map.length;
		let copy = this.initializePoints();
		this.map.map(arr => {
			arr.map(point => {
				if (point.isActive()) {
					let position = point.getPosition();

					//for antiClock side
					//copy[length - position.Y - 1][position.X].setActive(true);

					//for Clock side
					copy[position.Y][length - position.X - 1].setActive(true);
				}
			});
		});
		return this.getActivePointsOnMap(copy, this.MapPosition);
	}
	move(isX = false, num = 1) {
		let X = this.MapPosition.X;
		let Y = this.MapPosition.Y;

		this.tmpMapPosition = {
			X: isX ? X + num : X,
			Y: isX ? Y : Y + num,
		};
		return this.getActivePointsOnMap(this.map, this.tmpMapPosition);
	}
	updateMapPosition() {
		Object.assign(this.MapPosition, this.tmpMapPosition);
	}
	updateActivePoints(points) {
		if (Array.isArray(points) && !Array.isArray(points[0])) {
			this.map = this.initializePoints();
			points.map(item => {
				let position = item.getPosition();
				this.setActive(position.X, position.Y);
			});
		}
	}
	getMapPosition() {
		return this.MapPosition;
	}
}

class TBox extends TetrisBase {
	constructor(color) {
		super(3, color);
		this.extendsActivePoints([
			[1, 1, 1],
			[0, 1, 0],
			[0, 1, 0],
		]);
	}
}
class LBox extends TetrisBase {
	constructor(color) {
		super(3, color);
		this.extendsActivePoints([
			[1, 0, 0],
			[1, 0, 0],
			[1, 1, 0],
		]);
	}
}
class JBox extends TetrisBase {
	constructor(color) {
		super(3, color);
		this.extendsActivePoints([
			[0, 0, 1],
			[0, 0, 1],
			[0, 1, 1],
		]);
	}
}
class ZBox extends TetrisBase {
	constructor(color) {
		super(3, color);
		this.extendsActivePoints([
			[0, 1, 0],
			[1, 1, 0],
			[1, 0, 0],
		]);
	}
}
class SquareBox extends TetrisBase {
	constructor(color) {
		super(2, color);
		this.extendsActivePoints([
			[1, 1],
			[1, 1],
		]);
	}
}
class ZFlipBox extends TetrisBase {
	constructor(color) {
		super(3, color);
		this.extendsActivePoints([
			[0, 1, 0],
			[0, 1, 1],
			[0, 0, 1],
		]);
	}
}
class DotBox extends TetrisBase {
	constructor(color) {
		super(1, color);
		this.extendsActivePoints([[1]]);
	}
}
class IBox extends TetrisBase {
	constructor(color) {
		super(3, color);
		this.extendsActivePoints([
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 0],
		]);
	}
}
class TriangleBox extends TetrisBase {
	constructor(color) {
		super(3, color);
		this.extendsActivePoints([
			[0, 0, 0],
			[0, 1, 0],
			[1, 1, 1],
		]);
	}
}
const TetrisBox = {
	T: TBox,
	L: LBox,
	J: JBox,
	I: IBox,
	Z: ZBox,
	ZFlip: ZFlipBox,
	Square: SquareBox,
	Triangle: TriangleBox,
	Dot: DotBox,
};
export default TetrisBox;
