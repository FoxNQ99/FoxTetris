import ENV from "../env.js";
import FRandom from "../ExtentionsMethods/FRandom.js";
import Utils from "../services/Utils.js";

("use strict");

class Menu {
	constructor(username, callback) {
		this.container = Utils.dom("div", {
			id: ENV.ID.menu,
			className: ENV.className.menuContainer,
		});

		let title = Utils.dom("h1", {
			parent: this.container,
			text: ENV.content.title,
			className: ENV.className.title,
		});

		if (!username) {
			let menuInput = Utils.dom("input", {
				parent: this.container,
				id: ENV.ID.menuInput,
				attributes: [
					["placeholder", ENV.content.menuInput],
					["type", "text"],
				],
			});
		} else {
			let lbHello = Utils.dom("p", {
				parent: this.container,
				id: ENV.ID.menuHelloString,
				text: FRandom.PickRandomHello() + username,
			});
		}

		let btnStart = Utils.dom("button", {
			id: username ? ENV.ID.menuStartBtnBig : ENV.ID.menuStartBtn,
			parent: this.container,
			text: ENV.content.start,
		});
		if (typeof callback === "function") {
			Utils.addEvent(btnStart, "click", callback);
		}
		return this.container;
	}
}
export default Menu;
