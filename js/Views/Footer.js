import { CName, IDs } from "../configs/env.js";
import Container from "../Models/Container.js";
import Utils from "../services/Utils.js";

("use strict");

class Footer extends Container {
	constructor(params) {
		super({
			className: CName.footerContainer,
			parent: Utils.id(IDs.root),
			zIndex: 99,
		});
		this.elements = this.initElements(params);
		this.applyElements();
	}
	initElements() {
		let elements = {
			mark: Utils.dom("span", {
				className: CName.footerDesc,
				text: "Design, Coding By FoxNQ99 On JavaScript Vanilla \n\n ",
			}),
			githubLink: Utils.dom("a", {
				className: CName.footerDesc,
				text: "GitHub",
				attributes: [["href", "https://github.com/FoxNQ99/"]],
			}),
			email: Utils.dom("span", {
				className: CName.footerDesc,
				text: " - Email: FoxNQ99@gmail.com",
			}),
		};
		return elements;
	}
}

export default Footer;
