import ENV from "../configs/env.js";
import Container from "../Models/Container.js";
import InfoContainer from "../Models/InfoContainer.js";
import GlobalElements from "../services/GlobalElements.js";
import Utils from "../services/Utils.js";

("use strict");

class GameContainer extends Container {
	constructor() {
		super({
			className: ENV.className.gameContainer,
			parent: Utils.qs(`#${ENV.ID.root}`),
		});
		this.elements = this.initElements();
		this.applyElements();
	}
	initElements() {
		let self = this;
		let elements = {
			title: GlobalElements.title(),

			mapNode: Utils.dom("div", {
				className: ENV.className.mapContainer,
				id: ENV.ID.mapContainer,
			}),

			infoNode: Utils.dom("div", {
				className: ENV.className.gameInfoContainer,
			}),
		};
		let infoNodes = self.initInfoNodes();

		Utils.appendChildrens(elements.infoNode, infoNodes);
		return elements;
	}
	initInfoNodes() {
		return {
			playerName: new InfoContainer({
				id: ENV.ID.lbUsername,
				desc: "",
				child: "",
			}).getContainer(),

			scoreNode: new InfoContainer({
				id: ENV.ID.lbScore,
				desc: ENV.content.descScore,
				child: "0",
			}).getContainer(),

			nextBoxNode: new InfoContainer({
				id: ENV.ID.nextBox,
				desc: ENV.content.descNextBox,
				child: Utils.dom("div", {}),
			}).getContainer(),
		};
	}
}
export default GameContainer;
