import Box from "./Box.js";
import Point from "./Point.js";

("use strict");

class TetrisBox extends Box {
	constructor(size, color) {
		super(size, color);
		this.MapPosition = {
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
	getActivePointsOnMap(arr2D) {
		let self = this;
		let activePoints = [];
		if (this.isArray2D(arr2D)) {
			arr2D.map(arr =>
				arr.map(item => {
					if (item.isActive()) {
						let position = item.getPosition();
						let XMap = position.X + self.MapPosition.X;
						let YMap = position.Y + self.MapPosition.Y;
						let modifierPoint = new Point(XMap, YMap, true, self.color);
						activePoints.push(modifierPoint);
					}
				}),
			);
		}
		return activePoints;
	}
	getActivePoints() {
		return this.getActivePointsOnMap(this.map);
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
		return this.getActivePointsOnMap(copy);
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
}
export default TetrisBox;
