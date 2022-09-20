import ENV from "../configs/env.js";
import CusElement from "../Models/CusElement.js";
import FRandom from "../services/FRandom.js";
import GlobalElements from "../services/GlobalElements.js";
import Utils from "../services/Utils.js";

("use strict");

class Menu extends CusElement {
	constructor() {
		super({
			tagName: "div",
			className: ENV.className.menuContainer,
			id: ENV.ID.menu,
			parent: Utils.qs(`#${ENV.ID.root}`),
		});
		this.initElements();
		this.showInput();
	}
	initElements() {
		this.title = GlobalElements.title(this.container);
		this.menuInput = new CusElement({
			tagName: "input",
			parent: this.container,
			id: ENV.ID.menuInput,
			attributes: [
				["placeholder", ENV.content.menuInput],
				["type", "text"],
			],
		});
		this.lbHello = new CusElement({
			tagName: "p",
			id: ENV.ID.menuHelloString,
			text: FRandom.PickRandomHello(),
		});
		this.btnStart = new CusElement({
			tagName: "button",
			id: ENV.ID.menuStartBtn,
			parent: this.container,
			text: ENV.content.start,
		});
	}
	showInput() {
		this.lbHello.hide();
		this.menuInput.show();
	}
	hideInput() {
		this.lbHello.show();
		this.menuInput.hide();
	}
}
// class Menu {
// 	constructor() {
// 		this.container = Utils.dom("div", {
// 			id: ENV.ID.menu,
// 			className: ENV.className.menuContainer,
// 		});

// 	}
// 	showTitle(){
// 		let title = Utils.dom("h1", {
// 			parent: this.container,
// 			text: ENV.content.title,
// 			className: ENV.className.title,
// 		});

// 		if (!username) {

// 		} else {

// 		}

// 		let btnStart = Utils.dom("button", {
// 			id: username ? ENV.ID.menuStartBtnBig : ENV.ID.menuStartBtn,
// 			parent: this.container,
// 			text: ENV.content.start,
// 		});
// 		if (typeof callback === "function") {
// 			Utils.addEvent(btnStart, "click", callback);
// 		}
// 	}
// 	showInput(){
// 		Utils.qs(`#${ENV.ID.menuHelloString}`)?.
// 		let menuInput = Utils.dom("input", {
// 			parent: this.container,
// 			id: ENV.ID.menuInput,
// 			attributes: [
// 				["placeholder", ENV.content.menuInput],
// 				["type", "text"],
// 			],
// 		});
// 	}
// 	setUserName(username){
// 		let lbHello = Utils.dom("p", {
// 			parent: this.container,
// 			id: ENV.ID.menuHelloString,
// 			text: FRandom.PickRandomHello() + username,
// 		});
// 	}
// }
export default Menu;
