import CusErr from "../services/CustomERR.js";
import Utils from "../services/Utils.js";

("use strict");

class CusElement {
	constructor(params) {
		this.container = params.selector ? Utils.qs(params.selector) : Utils.dom(params.tagName || "div", params);
		if (!this.container) {
			CusErr.Show("can't create Element from nothing");
			return;
		}
		if (params.parent) {
			this.parent = params.parent;
		}
	}
	setChildren(element) {
		if (element) {
			this.container.append(element);
		}
	}
	getContainer() {
		return this.container;
	}
	show(hideOtherChild = false) {
		if (this.parent) {
			if (hideOtherChild) {
				this.parent.children.forEach(element => {
					element.style.display = "none";
				});
			}
		}
		this.container.style.display = "inline-block";
	}
	hide() {
		this.container.style.display = "none";
	}
}
export default CusElement;
