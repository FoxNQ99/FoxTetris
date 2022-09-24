import { CName } from "../configs/env.js";
import Utils from "../services/Utils.js";
import Container from "./Container.js";

("use strict");

class InfoContainer extends Container {
	constructor(params) {
		super({
			className: CName.infoContainer,
		});
		let elements = this.initElements(params);
		Utils.appendChildrens(this.container, elements);
	}
	initElements(params) {
		let childIsString = typeof params.child === "string";

		let descNode = Utils.dom("p", {
			className: CName.infoDesc,
			text: params.desc,
		});

		let contentNode = null;

		if (childIsString) {
			contentNode = Utils.dom("p", {
				text: params.child,
			});
		} else {
			contentNode = params.child;
		}
		contentNode.id = params.id;
		contentNode.className = CName.infoContent;
		return {
			descNode,
			contentNode,
		};
	}
}

export default InfoContainer;
