import Config from "../configs/config.js";
import ENV from "../configs/env.js";
import Box from "../Models/Box.js";
import Player from "../Models/Player.js";
import Cleaner from "../services/Cleaner.js";
import FRandom from "../services/FRandom.js";
import Utils from "../services/Utils.js";
import GameContainer from "../Views/GameContainer.js";
import Menu from "../Views/MenuContainer.js";
import TetrisBox from "../Models/TetrisBoxs.js";

("use strict");

class GameController {
	constructor(params) {
		this.initVariable();
		this.Tetris.setup();
	}
	initVariable() {
		this.menu = new Menu();
		this.game = new GameContainer();
		this.config = new Config();
		this.map = null;
		this.mapNode = Utils.id(ENV.ID.mapContainer);
		this.player = new Player();
		this.Boxs = {
			current: undefined,
			next: undefined,
		};
		this.timer = null;
	}
	Tetris = {
		setup: () => {
			let self = this;
			self.Render.Menu();

			Utils.addEvent(Utils.qs(`#${ENV.ID.menuStartBtn}`), "click", () => {
				self.Tetris.start();
			});
			document.addEventListener("keydown", key => {
				if (!self.player.IsLose()) {
					switch (key.key) {
						case "s":
						case "ArrowDown":
							self.ModifierBox.moveCurrent(false, 1);
							break;
						case "a":
						case "ArrowLeft":
							self.ModifierBox.moveCurrent(true, -1);
							break;
						case "d":
						case "ArrowRight":
							self.ModifierBox.moveCurrent(true, 1);
							break;
						case "r":
						case " ":
							self.ModifierBox.rotateCurrent();
							break;
					}
				}
			});
		},

		start: () => {
			let self = this;
			let txbInput = Utils.qs(`#${ENV.ID.txbUserName}`);
			if (txbInput && !self.player.getName()) {
				let username = Cleaner.Text(txbInput.value);
				self.player.setName(username);
			}
			self.Render.Game();
			Utils.setText(ENV.ID.lbUsername, self.player.getName());

			let mapSize = this.config.getMapSize();

			self.map = new Box([mapSize.width, mapSize.height], "red");

			//setup gameSize
			let gameSize = self.config.getGameSize();
			Object.assign(this.mapNode.style, gameSize);
			//reset Player
			self.player.reset();

			self.ModifierBox.randomNext();
			self.ModifierBox.randomNext();
			console.log(this.Boxs.current);
			self.timer = setInterval(() => {
				self.ModifierBox.moveCurrent(false, 1);
			}, self.config.getDelay());
		},

		end: () => {
			let self = this;
			clearInterval(self.timer);
			//Show End
			self.player.setLose(true);
			setTimeout(() => {
				self.Render.Menu();
			}, 3000);
		},
	};
	Render = {
		Frame: () => {
			let self = this;
			Utils.clear(this.mapNode);
			let activePoints = self.map.getActivePoints();
			let currentBoxPoints = this.Boxs.current.getActivePoints();
			activePoints = activePoints.concat(currentBoxPoints);

			activePoints.map(item => {
				let element = this.genarateElementByPoint(item);
				self.mapNode.append(element);
			});
		},
		Menu: () => {
			let self = this;
			self.game.hide();
			self.menu.show();
			if (self.player.getName()) {
				self.menu.displayInput(false);
				Utils.setText(ENV.ID.lbHello, FRandom.PickRandomHello() + self.player.getName());
			} else {
				self.menu.displayInput(true);
			}
		},
		Game: () => {
			let self = this;

			self.menu.hide();
			self.game.show();
		},
	};
	ModifierMap = {
		applyPoints: points => {
			let self = this;
			if (Array.isArray(points)) {
				points.map(item => {
					let position = item.getPosition();
					self.map.setActive(position.X, position.Y, item.isActive(), item.getColor());
				});
			}
		},
		checkPosition: points => {
			let self = this;
			let canMove = true;
			let mapSize = self.config.getMapSize();
			points.every(item => {
				let position = item.getPosition();

				if (position.X < 0 || position.X >= mapSize.width || position.Y >= mapSize.height || self.map.isActive(position.X, position.Y)) {
					canMove = false;
					return false;
				}
				return true;
			});
			return canMove;
		},
	};
	ModifierBox = {
		randomNext: () => {
			this.Boxs.current = this.Boxs.next || null;
			this.Boxs.next = FRandom.PickRandomBox();
		},
		moveCurrent: (isX = false, num = 1) => {
			let self = this;
			let current = self.Boxs.current;
			let points = current.move(isX, num);
			let currentPosition = current.getMapPosition();
			if (self.ModifierMap.checkPosition(points)) {
				current.updateMapPosition();
				self.Render.Frame();
			} else if (!isX) {
				self.ModifierMap.applyPoints(current.getActivePoints());
				if (currentPosition.Y === 0) {
					self.Tetris.end();
				} else {
					self.ModifierBox.randomNext();
				}
			}
		},
		rotateCurrent: () => {
			let self = this;
			let points = self.Boxs.current.rotate();
			if (self.ModifierMap.checkPosition(points)) {
				self.Boxs.current.updateActivePoints(points);
				self.Render.Frame();
			}
		},
	};
	Test() {
		let self = this;
	}

	genarateElementByPoint(item) {
		let self = this;
		let position = item.getPosition();
		let element = Utils.dom("span", {
			className: [ENV.className.point, ENV.className.activePoint],
			id: `map${position.X}-${position.Y}`,
		});
		Utils.setStyle(element, self.generatePointStyle(item));
		return element;
	}
	generatePointStyle(item) {
		let self = this;
		let pointSize = self.config.getPointSize();
		let position = item.getPosition();
		return {
			backgroundColor: item.getColor(),
			width: pointSize + "px",
			height: pointSize + "px",
			marginTop: pointSize * position.Y + "px",
			marginLeft: pointSize * position.X + "px",
		};
	}
}

export default GameController;
