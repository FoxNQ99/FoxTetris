import Container from "../Models/Container.js";
import { CName, EContent, IDs, LocalVar } from "../configs/env.js";
import Player from "../Models/Player.js";
import FRandom from "../services/FRandom.js";
import Utils from "../services/Utils.js";

("use strict");

class GameOver extends Container {
	constructor(params) {
		super({
			tagName: "div",
			className: CName.overContainer,
			parent: Utils.qs(`#${IDs.root}`),
		});
		this.elements = this.initElements();
		this.timeLeft = 3;
		this.Player = null;
		this.applyElements();
	}
	initElements() {
		let self = this;
		let elements = {
			lbTitle: Utils.dom("p", {
				className: CName.overTitle,
				text: EContent.lose,
			}),
			lbDesc: Utils.dom("p", {
				className: CName.overDesc,
				text: FRandom.PickRandomOverText(),
			}),
			lbHighScore: Utils.dom("p", {
				className: CName.overContent,
				id: IDs.lbOverHighScore,
			}),
			lbPlayerScore: Utils.dom("p", {
				className: CName.overContent,
				id: IDs.lbPlayerScore,
			}),
			lbTimer: Utils.dom("p", {
				className: CName.overDesc,
				id: IDs.lbOverTimeLeft,
			}),
		};

		return elements;
	}
	updatePlayer(player) {
		if (player instanceof Player) {
			this.Player = player;
			let scoreStored = localStorage.getItem(LocalVar.highScore);
			let playScore = this.Player.getScore();
			if (scoreStored < playScore && !scoreStored) {
				localStorage.removeItem(LocalVar.highScore);
				localStorage.setItem(LocalVar.highScore, playScore);
				this.HighScore = playScore;
			} else {
				this.HighScore = scoreStored;
			}
		}
	}
	show(seconds = 3) {
		let self = this;
		this.container.style.display = "inline-block";
		this.timeLeft = seconds + 1;
		Utils.setText(IDs.lbOverHighScore, EContent.highScore + self.HighScore || 0);
		Utils.setText(IDs.lbPlayerScore, EContent.playerScore + self.Player?.getScore() || 0);

		return new Promise(res => {
			let timer = setInterval(() => {
				self.timeLeft--;
				Utils.setText(IDs.lbOverTimeLeft, `Go to Main Menu in ${self.timeLeft}s`);
				if (self.timeLeft <= 0) {
					self.hide();
					res(true);
					clearInterval(timer);
				}
			}, 1000);
		});
	}
}

export default GameOver;
