import ENV from "../configs/env.js";
import Container from "../Models/Container.js";
import FRandom from "../services/FRandom.js";
import GlobalElements from "../services/GlobalElements.js";
import Utils from "../services/Utils.js";

("use strict");

class Menu extends Container {
	constructor() {
		super({
			tagName: "div",
			className: ENV.className.menuContainer,
			id: ENV.ID.menu,
			parent: Utils.qs(`#${ENV.ID.root}`),
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
				id: ENV.ID.txbUserName,
				attributes: [
					["placeholder", ENV.content.menuInput],
					["type", "text"],
				],
			}),

			lbHello: Utils.dom("p", {
				id: ENV.ID.lbHello,
				text: "",
			}),

			btnStart: Utils.dom("button", {
				id: ENV.ID.menuStartBtn,
				text: ENV.content.start,
			}),
		};

		return elements;
	}

	displayInput(isDisplay = false) {
		let txbInput = Utils.qs(`#${ENV.ID.txbUserName}`);
		let lbHello = Utils.qs(`#${ENV.ID.lbHello}`);

		if (txbInput && lbHello) {
			txbInput.style.display = isDisplay ? "inline-block" : "none";
			lbHello.style.display = isDisplay ? "none" : "inline-block";
		}
	}
}
export default Menu;
