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
import TetrisBox from "../Models/TetrisBoxs.js";
import GameMap from "../Models/GameMap.js";
import { Color } from "../services/Color.js";

("use strict");

class GameController {
	constructor(params) {
		this.initVar();
		this.TetrisGame.init();
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

			self.TetrisGame.setSizeNextBox(0);
			self.TetrisGame.setupButtonStart();
			self.TetrisGame.setupKeyBoard();
			self.Player.setLose(true);
			self.showMenu();
		},

		setSizeNextBox: pointNumber => {
			let self = this;

			let pointSize = self.config.getPointSize();
			let ENextBox = Utils.id(IDs.nextBox);

			Utils.setStyle(ENextBox, {
				with: pointSize * (5 - pointNumber),
				height: pointSize * (5 - pointNumber),
			});
		},

		setupGameMap: () => {
			let self = this;
			Utils.clear(self.MapNode);
			Utils.setStyle(self.MapNode, self.config.getGameSize());
			let mapSize = self.config.getMapSize();
			self.map = new GameMap({
				width: mapSize.width,
				height: mapSize.height,
				color: Color.Blue,
			});
		},

		setupButtonStart: () => {
			let self = this;
			Utils.addEvent(Utils.id(IDs.menuStartBtn), "click", () => {
				self.TetrisGame.start();
			});
		},

		setupKeyBoard: () => {
			let self = this;
			document.addEventListener("keydown", key => {
				if (!self.Player.IsLose()) {
					switch (key.key) {
						case "s":
						case "ArrowDown":
							self.Boxs.moveCurrent(false, 1);
							break;
						case "a":
						case "ArrowLeft":
							self.Boxs.moveCurrent(true, -1);
							break;
						case "d":
						case "ArrowRight":
							self.Boxs.moveCurrent(true, 1);
							break;
						case "r":
						case " ":
							self.Boxs.rotateCurrent();
							break;
					}
				}
			});
		},

		start: () => {
			let self = this;

			self.renderGame();
			Utils.clear(self.MapNode);
			self.Player.reset();
			self.TetrisGame.setupGameMap();
			//self.TetrisGame.gameStep();

			//TestZone
			self.Test();
		},
		gameStep: () => {
			let self = this;
			while (!self.Boxs.next) {
				self.Boxs.randomNext();
			}
			self.timer = setInterval(() => {
				self.Boxs.moveCurrent(false, 1);
			}, self.config.getDelay());
		},
		end: () => {
			let self = this;
			clearInterval(self.timer);
			setTimeout(() => {
				self.showMenu();
			}, 3000);
		},
	};
	showMenu() {
		let self = this;

		self.game.hide();
		self.menu.show();
		if (self.Player.getName()) {
			self.menu.displayInput(false);
			Utils.setText(IDs.lbHello, FRandom.PickRandomHello() + self.Player.getName());
		} else {
			self.menu.displayInput(true);
		}
	}
	renderGame() {
		let self = this;

		self.menu.hide();
		self.game.show();
	}
	renderScore() {
		let self = this;
		Utils.setText(IDs.lbScore, self.Player.getScore());
	}
	renderFrame(clear = false) {
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
		if (clear) {
			let mapElements = self.GenerateEle.byBox(self.map, IDs.map, false);
			currentElements = currentElements.concat(mapElements);
		}
		Utils.render(self.MapNode, currentElements);
		self.renderScore();
	}
	showNextBox() {
		let self = this;

		if (self.Boxs.next) {
			let nextBoxElement = Utils.id(IDs.nextBox);
			let elements = self.GenerateEle.byBox(self.Boxs.next, IDs.nextBox, false);
			Utils.render(nextBoxElement, elements, true);
		}
	}
	Boxs = {
		current: undefined,

		next: undefined,

		randomNext: () => {
			this.Boxs.current = this.Boxs.next || null;
			this.Boxs.next = new TetrisBox.I("red"); //FRandom.PickRandomBox();
			this.showNextBox();
		},

		moveCurrent: (isX = false, num = 1) => {
			let self = this;
			let current = self.Boxs.current;
			if (current) {
				let points = current.move(isX, num);
				let currentPosition = current.getMapPosition();
				if (self.GameMap.checkPosition(points)) {
					current.updateMapPosition();
					self.renderFrame();
				} else if (!isX) {
					self.GameMap.applyPoints(current.getActivePoints());
					if (currentPosition.Y === 0) {
						self.TetrisGame.end();
					} else {
						self.GameMap.checkScore();
						self.Boxs.randomNext();
					}
				}
			}
		},

		rotateCurrent: () => {
			let self = this;
			let points = self.Boxs.current.rotate();
			if (self.GameMap.checkPosition(points)) {
				self.Boxs.current.updateActivePoints(points);
				self.renderFrame();
			}
		},
	};
	GameMap = {
		clearLine: line => {},
		checkScore: () => {
			let self = this;
			if (self.map) {
				let maxWidth = self.config.getMapSize().height;
				let pointActives = 0;
				let lineChecking = maxWidth;
				for (let Y = maxWidth - 1; Y >= 0; Y--) {
					if (self.map.lineIsFull(Y)) {
						self.map.clearLine(Y);
						self.Player.setScore();
						self.renderFrame(true);
						Y++;
					}
				}
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
	Test() {
		let points = [];
		for (let Y = 20; Y < 25; Y++) {
			for (let i = 3; i < 15; i++) {
				points.push(new Point(i, Y, true, "red"));
			}
		}
		this.GameMap.applyPoints(points);
		this.Boxs.randomNext();
		this.Boxs.randomNext();
	}
}

export default GameController;
