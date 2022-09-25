import { CName, IDs, EContent } from "../configs/env.js";
import Container from "../Models/Container.js";
import InfoContainer from "../Models/InfoContainer.js";
import GlobalElements from "../services/GlobalElements.js";
import Utils from "../services/Utils.js";

("use strict");

class GameContainer extends Container {
	constructor() {
		super({
			className: CName.gameContainer,
			parent: Utils.id(IDs.root),
		});
		this.elements = this.initElements();
		this.applyElements();
	}
	initElements() {
		let self = this;
		let elements = {
			title: GlobalElements.title(),

			mapNode: Utils.dom("div", {
				className: CName.mapContainer,
				id: IDs.mapContainer,
			}),

			infoNode: Utils.dom("div", {
				className: CName.gameInfoContainer,
			}),
		};
		let infoNodes = self.initInfoNodes();

		Utils.appendChildrens(elements.infoNode, infoNodes);
		return elements;
	}
	initInfoNodes() {
		return {
			playerName: new InfoContainer({
				id: IDs.lbUsername,
				desc: "",
				child: "",
			}).getContainer(),

			scoreNode: new InfoContainer({
				id: IDs.lbScore,
				desc: EContent.descScore,
				child: "0",
			}).getContainer(),

			nextBoxNode: new InfoContainer({
				parentID: IDs.nextBoxContainer,
				id: IDs.nextBox,
				desc: EContent.descNextBox,
				child: Utils.dom("div", {}),
			}).getContainer(),
		};
	}
}
export default GameContainer;
