//config
import Config from "../configs/config.js";
import { CName, IDs, EContent } from "../configs/env.js";

//Models
import Box from "../Models/Box.js";
import Player from "../Models/Player.js";
import Point from "../Models/Point.js";
//services
import Cleaner from "../services/Cleaner.js";
import FRandom from "../services/FRandom.js";
import Utils from "../services/Utils.js";
import MenuContainer from "../Views/MenuContainer.js";
import GameContainer from "../Views/GameContainer.js";

("use strict");

class GameController {
	constructor(params) {
		this.initVar();
		this.TetrisGame.init();
		this.Render.Menu();
	}
	initVar() {
		let self = this;
		self.RootNode = Utils.id(IDs.root);
		if (!self.RootNode) {
			console.error("cant Find Root Node");
			return;
		}
		self.config = new Config();
		self.menu = new MenuContainer();
		self.game = new GameContainer();

		self.map = null;
		self.MapNode = Utils.id(IDs.mapContainer);
		this.Player = new Player();
		this.timer = null;
	}
	TetrisGame = {
		init: () => {
			let self = this;
			self.TetrisGame.setupSizeElements();
			Utils.addEvent(Utils.id(IDs.menuStartBtn), "click", () => {
				self.TetrisGame.start();
			});

			document.addEventListener("keydown", key => {
				if (!self.Player.IsLose()) {
					switch (key.key) {
						case "s":
						case "ArrowDown":
							self.Boxs.move(false, 1);
							break;
						case "a":
						case "ArrowLeft":
							self.Boxs.move(true, -1);
							break;
						case "d":
						case "ArrowRight":
							self.Boxs.move(true, 1);
							break;
						case "r":
						case " ":
							self.Boxs.rotate();
							break;
					}
				}
			});

			self.Player.setLose(true);
		},

		setupSizeElements: () => {
			let self = this;

			let pointSize = self.config.getPointSize();
			let nextBox = self.Boxs.next;
			if (nextBox) {
				let ENextBox = Utils.id(IDs.nextBox);
				Utils.setStyle(ENextBox, {
					with: pointSize * (5 - nextBox.getSize().width),
					height: pointSize * (5 - nextBox.getSize().height),
				});
			}

			Utils.setStyle(self.MapNode, self.config.getGameSize());
		},

		start: () => {
			let self = this;

			self.Render.Game();
			Utils.clear(self.MapNode);
			self.Player.reset();

			let mapSize = self.config.getMapSize();
			self.map = new Box([mapSize.width, mapSize.height], "red");

			self.Boxs.randomNext();
			self.Boxs.randomNext();

			self.timer = setInterval(() => {
				self.Boxs.move(false, 1);
			}, self.config.getDelay());
		},

		end: () => {
			let self = this;
			clearInterval(self.timer);
			setTimeout(() => {
				self.Render.Menu();
			}, 3000);
		},
	};
	Render = {
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

		Frame: (clear = false) => {
			let self = this;
			if (clear) {
				Utils.clear(self.MapNode);
			} else {
				let tmpElements = document.querySelectorAll(`#${IDs.tmpPoint}`);
				tmpElements.forEach(ele => {
					ele.remove();
				});
			}
			let currentElements = self.GenerateEle.byBox(self.Boxs.current, IDs.tmpPoint, true);

			Utils.render(self.MapNode, currentElements);
		},

		nextBox: () => {
			let self = this;

			if (self.Boxs.next) {
				let nextBoxElement = Utils.id(IDs.nextBox);
				let elements = self.GenerateEle.byBox(self.Boxs.next, IDs.nextBox, false);
				Utils.render(nextBoxElement, elements, true);
			}
		},
	};
	Boxs = {
		current: undefined,

		next: undefined,

		randomNext: () => {
			this.Boxs.current = this.Boxs.next || null;
			this.Boxs.next = FRandom.PickRandomBox();
			this.Render.nextBox();
		},

		move: (isX = false, num = 1) => {
			let self = this;
			let current = self.Boxs.current;
			if (current) {
				let points = current.move(isX, num);
				let currentPosition = current.getMapPosition();
				if (self.GameMap.checkPosition(points)) {
					current.updateMapPosition();
					self.Render.Frame();
				} else if (!isX) {
					self.GameMap.applyPoints(current.getActivePoints());
					if (currentPosition.Y === 0) {
						self.TetrisGame.end();
					} else {
						self.Boxs.randomNext();
					}
				}
			}
		},

		rotate: () => {
			let self = this;
			let points = self.Boxs.current.rotate();
			if (self.GameMap.checkPosition(points)) {
				self.Boxs.current.updateActivePoints(points);
				self.Render.Frame();
			}
		},
	};
	GameMap = {
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

		applyPoints: points => {
			let self = this;
			if (Array.isArray(points)) {
				points.map(item => {
					let position = item.getPosition();
					self.map.setActive(position.X, position.Y, item.isActive(), item.getColor());
					Utils.render(self.MapNode, self.GenerateEle.byPoint(item, "map"));
				});
			}
		},
	};
	GenerateEle = {
		byPoint: (item, subID = "map", isTmp = false, reRender = false) => {
			let self = this;

			let position = item.getPosition();
			let id = isTmp ? subID : `${subID}${position.X}-${position.Y}`;
			let ele = Utils.id(id);
			if (!ele || reRender) {
				let element = Utils.dom("span", {
					className: [CName.point, isTmp ? CName.tmpPoint : CName.activePoint],
					id,
				});
				Utils.setStyle(element, self.GenerateEle.PointStyle(item));
				return element;
			}
			return null;
		},

		byBox: (box, subID = "map", isTmp = false, reRender = false) => {
			let self = this;
			let elements = [];

			if (box instanceof Box) {
				let points = box.getActivePoints();
				points.map(item => {
					let ele = self.GenerateEle.byPoint(item, subID, isTmp, reRender);
					if (ele) {
						elements.push(ele);
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
