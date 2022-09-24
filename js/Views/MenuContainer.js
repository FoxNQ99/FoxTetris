import { CName, IDs, EContent } from "../configs/env.js";
import Container from "../Models/Container.js";
import FRandom from "../services/FRandom.js";
import GlobalElements from "../services/GlobalElements.js";
import Utils from "../services/Utils.js";

("use strict");

class Menu extends Container {
	constructor() {
		super({
			tagName: "div",
			className: CName.menuContainer,
			id: IDs.menu,
			parent: Utils.qs(`#${IDs.root}`),
		});
		this.elements = this.initElements();
		this.applyElements();
		this.displayInput(true);
	}
	initElements() {
		let self = this;

		let elements = {
			title: GlobalElements.title(),

			menuInput: Utils.dom("input", {
				id: IDs.txbUserName,
				attributes: [
					["placeholder", EContent.menuInput],
					["type", "text"],
				],
			}),

			lbHello: Utils.dom("p", {
				id: IDs.lbHello,
				text: "",
			}),

			btnStart: Utils.dom("button", {
				id: IDs.menuStartBtn,
				text: EContent.start,
			}),
		};

		return elements;
	}

	displayInput(isDisplay = false) {
		let txbInput = Utils.qs(`#${IDs.txbUserName}`);
		let lbHello = Utils.qs(`#${IDs.lbHello}`);

		if (txbInput && lbHello) {
			txbInput.style.display = isDisplay ? "inline-block" : "none";
			lbHello.style.display = isDisplay ? "none" : "inline-block";
		}
	}
}
export default Menu;
