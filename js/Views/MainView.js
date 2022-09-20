import ENV from "../configs/env.js";
import CusErr from "../services/CustomERR.js";
import Utils from "../services/Utils.js";
import GameContainer from "./GameContainer.js";
import Menu from "./MenuContainer.js";

("use strict");

class View {
	constructor() {
		const RootElement = Utils.qs(`#${ENV.ID.root}`);
		if (!RootElement) {
			CusErr.Show("Cant find Root Element");
			return;
		}
		this.Root = RootElement;
		this.menu = new Menu();
		this.game = new GameContainer();
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
	renderMenu() {
		this.game.hide();
		this.menu.show();
	}
	renderGame() {
		this.menu.hide();
		this.game.show();
	}
}
export default View;
