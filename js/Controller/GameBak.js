import Config from "../configs/config.js";
import { CName, IDs, EContent } from "../configs/env.js";
import Box from "../Models/Box.js";
import Player from "../Models/Player.js";
import Cleaner from "../services/Cleaner.js";
import FRandom from "../services/FRandom.js";
import Utils from "../services/Utils.js";
import GameContainer from "../Views/GameContainer.js";
import Menu from "../Views/MenuContainer.js";
import TetrisBox from "../Models/TetrisBoxs.js";
import Point from "../Models/Point.js";

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
		this.mapNode = Utils.id(IDs.mapContainer);
		this.Player = new Player();
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

			Utils.addEvent(Utils.qs(`#${IDs.menuStartBtn}`), "click", () => {
				self.Tetris.start();
			});

			document.addEventListener("keydown", key => {
				if (!self.Player.IsLose()) {
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

			self.Player.setLose(true);
		},

		start: () => {
			let self = this;
			self.ModifierMap.reset();
			if (!self.Player.getName()) {
				let txbInput = Utils.qs(`#${IDs.txbUserName}`);
				if (txbInput) {
					let username = Cleaner.Text(txbInput.value);
					self.Player.setName(username);
				}
			}
			self.Render.Game();

			Utils.setText(IDs.lbUsername, self.Player.getName());

			//setup gameSize
			let gameSize = self.config.getGameSize();
			Object.assign(this.mapNode.style, gameSize);
			//reset Player
			self.Player.reset();

			self.ModifierBox.randomNext();
			self.ModifierBox.randomNext();
			self.timer = setInterval(() => {
				self.ModifierBox.moveCurrent(false, 1);
			}, self.config.getDelay());
		},

		end: () => {
			let self = this;
			clearInterval(self.timer);
			//Show End
			self.Player.setLose(true);
			setTimeout(() => {
				self.Render.Menu();
				this.ModifierMap.reset();
			}, 3000);
		},
	};
	Render = {
		byPoints: (parent, points) => {
			let self = this;
		},
		Frame: () => {
			let self = this;
			Utils.clear(this.mapNode);
			let activePoints = self.map.getActivePoints();
			let currentBoxPoints = this.Boxs.current.getActivePoints();
			activePoints = activePoints.concat(currentBoxPoints);

			self.Render.byPoints(self.mapNode, activePoints);
		},
		Menu: () => {
			let self = this;
			self.game.hide();
			self.menu.show();
			if (self.Player.getName()) {
				self.menu.displayInput(false);
				Utils.setText(IDs.lbHello, FRandom.PickRandomHello() + self.Player.getName());
			} else {
				self.menu.displayInput(true);
			}
		},
		Game: () => {
			let self = this;

			self.menu.hide();
			self.game.show();
		},
		toMap: element => {
			let self = this;
			if (element !== null) {
				self.mapNode.append(element);
			}
		},
		nextBox: () => {
			let self = this;
			let nextBox = self.Boxs.next;
			let showBoxElement = Utils.qs(`#${IDs.nextBox}`);
			if (nextBox && showBoxElement) {
				let elements = self.HTMLGenerate.byPoints(nextBox.getActivePoints(), "next");
				showBoxElement.append(elements);
			}
		},
	};
	ModifierMap = {
		reset: () => {
			let self = this;
			Utils.clear(self.mapNode);

			let mapSize = self.config.getMapSize();

			this.map = new Box([mapSize.width, mapSize.height], "red");
		},
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
			this.Render.nextBox();
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
	HTMLGenerate = {
		byPoint: (item, subID = "map", reRender = false) => {
			let position = item.getPosition();
			let ele = Utils.qs(`${subID}${position.X}-${position.Y}`);
			if (!ele || reRender) {
				let self = this;
				let element = Utils.dom("span", {
					className: [CName.point, CName.activePoint],
					id: `map${position.X}-${position.Y}`,
				});
				Utils.setStyle(element, self.HTMLGenerate.PointStyle(item));
				return element;
			}
			return null;
		},
		byPoints: (points, subID = "map", reRender = false) => {
			let self = this;
			let elements = [];
			if (Array.isArray(points) && points[0] instanceof Point && parent) {
				points.map(item => {
					let element = self.HTMLGenerate.byPoint(item, subID, (reRender = false));
					if (element) {
						elements.push(element);
					}
				});
			}
			return elements;
		},
		PointStyle: item => {
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
		},
	};
}

export default GameController;
