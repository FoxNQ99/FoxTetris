import { EContent, CName } from "../configs/env.js";
import CusElement from "../Models/CusElement.js";
import Utils from "./Utils.js";

("use strict");

const GlobalElements = {
	title: () => {
		return Utils.dom("h2", {
			text: EContent.title,
			className: CName.title,
		});
	},
};
export default GlobalElements;
