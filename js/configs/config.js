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
	getPointSize() {
		return this.options.pointSize;
	}
	getMapSize() {
		return this.options.map;
	}
	getDelay() {
		return this.options.game.delay;
	}
	getGameSize() {
		return {
			width: this.getPointSize() * this.getMapSize().width + "px",
			height: this.getPointSize() * this.getMapSize().height + "px",
		};
	}
}
export default Config;
