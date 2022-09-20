import ENV from "../configs/env.js";
import CusElement from "../Models/CusElement.js";

("use strict");

const GlobalElements = {
	title: parrent => {
		return new CusElement({
			tagName: "h1",
			parent: parrent,
			text: ENV.content.title,
			className: ENV.className.title,
		});
	},
};
export default GlobalElements;
