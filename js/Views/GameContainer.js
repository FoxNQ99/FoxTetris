import ENV from "../configs/env.js";
import CusElement from "../Models/CusElement.js";
import GlobalElements from "../services/GlobalElements.js";
import Utils from "../services/Utils.js";

("use strict");

class GameContainer extends CusElement {
	constructor() {
		super({
			tagName: "div",
			className: ENV.className.gameContainer,
			id: ENV.ID.gameContainer,
			parent: Utils.qs(`#${ENV.ID.root}`),
		});
		this.initElements();
	}
	initElements() {
		let self = this;
		self.title = GlobalElements.title(self.container);

		self.map = new CusElement({
			tagName: "div",
			className: ENV.className.mapContainer,
			id: ENV.ID.mapContainer,
			parent: self.container,
		});

		self.info = {
			container: Utils.dom("div", {
				className: ENV.className.gameInfoContainer,
				parent: self.container,
			}),
			playerName: self.initInfoContainer({
				desc: "",
				id: ENV.ID.playerNameLabel,
				children: "",
			}),

			playerScore: self.initInfoContainer({
				desc: ENV.content.descScore,
				id: ENV.ID.scoreLabel,
				children: "0",
			}),

			nextBox: self.initInfoContainer({
				desc: ENV.content.descNextBox,
			}),
		};

		self.nextBoxContent = Utils.dom("div", {
			id: ENV.ID.nextBox,
			className: ENV.className.nextBoxContent,
		});

		self.info.nextBox.setChildren(self.nextBoxContent);
		//set Info Nodes to Container
	}
	initInfoContainer(params) {
		let self = this;
		let container = new CusElement({
			tagName: "div",
			className: ENV.className.infoContainer,
		});
		let desc = Utils.dom("p", {
			className: ENV.className.infoDesc,
			text: params.desc,
		});

		let content = null;
		if (typeof params.children === "string") {
			content = Utils.dom("p", {
				id: params.id,
				className: ENV.className.infoContent,
				text: params.children,
			});
		} else {
			content = params.children;
		}

		container.setChildren(desc);
		container.setChildren(content);
		self.container.append(container.getContainer());
		return container;
	}
}

export default GameContainer;
