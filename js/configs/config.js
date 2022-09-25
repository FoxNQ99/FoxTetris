("use strict");

class Config {
	constructor(params) {
		this.options = {
			map: {
				width: 15,
				height: 25,
			},
			pointSize: 25,
			game: {
				delay: 600, //in milies second
			},
		};
	}
	get PointSize() {
		return this.options.pointSize;
	}
	get MapSize() {
		return this.options.map;
	}
	get Delay() {
		return this.options.game.delay;
	}
	get GameSize() {
		return {
			width: this.PointSize * this.MapSize.width + "px",
			height: this.PointSize * this.MapSize.height + "px",
		};
	}
	get infoContainerSize() {}
}
export default Config;
