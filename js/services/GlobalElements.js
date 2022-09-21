import ENV from "../configs/env.js";
import CusElement from "../Models/CusElement.js";
import Utils from "./Utils.js";

("use strict");

const GlobalElements = {
	title: () => {
		return Utils.dom("h2", {
			text: ENV.content.title,
			className: ENV.className.title,
		});
	},
};
export default GlobalElements;
