"use strict";

import ENV from "../env.js";
import CusErr from "../ExtentionsMethods/CustomERR.js";
import Utils from "../services/Utils.js";
import Menu from "./Menu.js";

class View {
	constructor() {
		const RootElement = Utils.qs(`#${ENV.ID.root}`);
		if (!RootElement) {
			CusErr.Show("Cant find Root Element");
			return;
		}
		this.Root = RootElement;
	}
	clearRoot() {
		if (this.Root) {
			this.Root.innerHTML = "";
			return true;
		}
		return false;
	}
	renderToRoot(element, clear = false) {
		if (element) {
			clear ? this.clearRoot() : 0;
			this.Root.append(element);
		}
	}
	showMenu(username, callback) {
		this.renderToRoot(new Menu(username, callback), true);
	}
}
export default View;
