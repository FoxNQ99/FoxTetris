//config
import Config from "../configs/config.js";
import { CName, IDs, EContent, LocalVar } from "../configs/env.js";

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
import GameOver from "../Views/GameOver.js";

("use strict");

class GameController {
	constructor(params) {
		this.initVar();
		this.TetrisGame.init();
		this.debugMode = params.debugMode || false;
	}
	initVar() {
		let self = this;
		self.RootNode = Utils.id(IDs.root);
		self.setupBackground();
		if (!self.RootNode) {
			console.error("cant Find Root Node");
			return;
		}
		self.config = new Config();
		self.menu = new MenuContainer();
		self.game = new GameContainer();
		self.overScreen = new GameOver();

		self.map = null;
		self.MapNode = Utils.id(IDs.mapContainer);
		this.Player = new Player();
		this.timer = null;
	}
	setupBackground() {
		let background = Utils.dom("div", {
			className: CName.background,
			parent: this.RootNode,
		});
		let linearBG = Utils.dom("div", {
			className: CName.background,
			parent: background,
		});
		Utils.setStyle(linearBG, {
			backgroundImage: FRandom.Background(),
			opacity: 0.5,
		});
		Utils.setStyle(background, {
			backgroundColor: "gray",
			opacity: 0.5,
		});
	}
	TetrisGame = {
		init: () => {
			let self = this;

			self.TetrisGame.setSizeNextBox();
			self.TetrisGame.setupButtonStart();
			self.TetrisGame.setupKeyBoard();
			self.Player.setLose(true);
			self.showMenu();
		},

		setSizeNextBox: () => {
			let self = this;

			let pointSize = self.config.PointSize;
			let ENextBox = Utils.id(IDs.nextBox);
			Utils.setStyle(ENextBox, {
				width: pointSize * 5,
				height: pointSize * 5,
			});
		},

		setupGameMap: () => {
			let self = this;
			Utils.clear(self.MapNode);
			Utils.setStyle(self.MapNode, self.config.GameSize);
			let mapSize = self.config.MapSize;
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

			let localPlayerName = localStorage.getItem(LocalVar.username);
			let playerName = self.Player.getName();

			if (!playerName) {
				if (localPlayerName) {
					self.Player.setName(localPlayerName);
				} else {
					let txbInput = Utils.id(IDs.txbUserName);
					playerName = txbInput.value;
					console.log(playerName);

					self.Player.setName(playerName);
				}
			} else if (localPlayerName !== playerName) {
				localStorage.removeItem(LocalVar.username);
				localStorage.setItem(LocalVar.username, playerName);
			}
			Utils.setText(IDs.lbUsername, playerName);

			//setup TestZone
			if (self.debugMode) {
				self.DeBug.Test();
			} else {
				self.TetrisGame.gameStep();
			}
		},
		gameStep: () => {
			let self = this;
			while (!self.Boxs.current) {
				self.Boxs.randomNext();
			}
			self.timer = setInterval(() => {
				self.Boxs.moveCurrent(false, 1);
			}, self.config.Delay);

			self.Boxs.moveCurrent(false, 1);
		},
		end: () => {
			let self = this;
			clearInterval(self.timer);
			self.Player.setLose(true);
			self.overScreen.updatePlayer(self.Player);
			self.game.hide();
			self.menu.hide();
			self.overScreen.show(5).then(res => {
				self.showMenu();
			});
		},
	};
	showMenu() {
		let self = this;
		self.overScreen.hide();
		self.game.hide();
		self.menu.show();
		let playerName = localStorage.getItem(LocalVar.username);
		if (!playerName) {
			self.menu.displayInput(true);
		} else {
			self.menu.displayInput(false);
			self.Player.setName(playerName);
			Utils.setText(IDs.lbHello, FRandom.PickRandomHello() + self.Player.getName());
		}
	}
	renderGame() {
		let self = this;
		self.overScreen.hide();
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
			let elements = self.GenerateEle.byBox(self.Boxs.next, IDs.nextBox, false, false);
			Utils.render(nextBoxElement, elements, true);
		}
	}
	Boxs = {
		current: undefined,

		next: undefined,

		randomNext: () => {
			this.Boxs.current = this.Boxs.next || null;
			this.Boxs.next = FRandom.PickRandomBox();
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
					self.map.applyPoints(current.getActivePoints());
					if (currentPosition.Y === 0) {
						self.TetrisGame.end();
					} else {
						self.GameMap.checkScore();
						self.Boxs.randomNext();
						self.renderFrame(true);
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
				let maxWidth = self.config.MapSize.height;
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
			let mapSize = self.config.MapSize;
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
	GenerateEle = {
		byPoint: (item, subID = "map", isTmp = false, reRender = false) => {
			let self = this;

			let position = item.getPosition();
			let id = isTmp ? subID : `${subID}${position.X}-${position.Y}`;
			let element = Utils.dom("span", {
				className: [CName.point, isTmp ? CName.tmpPoint : CName.activePoint],
				id,
			});
			Utils.setStyle(element, self.GenerateEle.PointStyle(item));
			return element;
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
			let pointSize = self.config.PointSize;
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
	DeBug = {
		Test: () => {
			for (let Y = 20; Y < 25; Y++) {
				this.DeBug.setPoint(Y, 3, 15);
			}
			this.renderFrame(true);
			this.DeBug.spawBox(TetrisBox.L);
			this.DeBug.spawBox(TetrisBox.L);
		},
		setPoint: (Line, from, to) => {
			let self = this;
			let points = [];
			for (let i = from; i < to; i++) {
				points.push(new Point(i, Line, true, "red"));
			}
			self.map.applyPoints(points);
		},
		spawBox: tetrisBox => {
			if (tetrisBox) {
				this.Boxs.current = this.Boxs.next || null;
				this.Boxs.next = new tetrisBox("cyan");
				this.showNextBox();
			}
		},
	};
}

export default GameController;
