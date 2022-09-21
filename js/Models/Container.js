import Utils from "../services/Utils.js";

("use strict");

class Container {
	constructor(params) {
		this.container = Utils.dom("div", params);
		this.elements = {};
	}
	getContainer() {
		return this.container;
	}
	addNode(node) {
		if (node) {
			this.container.append(node);
		}
	}
	addTextNode(params) {
		let node = Utils.dom("p", params);
		this.addNode(node);
	}
	applyElements() {
		Utils.appendChildrens(this.container, this.elements);
	}
	show() {
		this.container.style.display = "inline-block";
	}
	hide() {
		this.container.style.display = "none";
	}
}
export default Container;
