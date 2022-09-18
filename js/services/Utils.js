"use strict";

const Utils = {
	qs: (selector, scope) => {
		return (document || scope).querySelector(selector);
	},
	addEvent: (element, ev, callback) => {
		if (element && ev && typeof callback === "function") {
			element.addEventListener(ev, callback);
		}
	},
	dom: (tag, options) => {
		let element = document.createElement(tag);

		if (options.parent) {
			options.parent.append(element);
		}
		if (options.id) {
			element.id = options.id;
		}
		if (options.className) {
			element.className = options.className;
		}
		if (options.text) {
			element.innerText = options.text;
		}
		if (options.attributes) {
			options.attributes.forEach(attr => {
				if (Array.isArray(attr) && attr.length >= 2) {
					let att = attr[0];
					let val = attr[1];
					element.setAttribute(att, val);
				}
			});
		}
		return element;
	},
	clear: element => {
		element ? (element.innerHTML = "") : 0;
	},
};
export default Utils;
