"use strict";

const Utils = {
	qs: (selector, scope) => {
		return (document || scope).querySelector(selector);
	},
	id: (id, scope) => {
		return (document || scope).querySelector(`#${id}`);
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
			if (Array.isArray(options.className)) {
				element.className = options.className.join(" ");
			} else {
				element.className = options.className;
			}
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
	show: element => {
		if (element) {
			element.style.display = "inline-block";
		}
	},
	hide: element => {
		if (element) {
			element.style.display = "none";
		}
	},
	appendChildrens: (parent, childs) => {
		if (parent) {
			let childNodes = typeof childs === "object" ? Object.values(childs) : childs;
			if (Array.isArray(childNodes)) {
				childNodes.map(element => {
					parent.append(element);
				});
			}
		}
	},
	setText: (id, content) => {
		let element = document.querySelector(`#${id}`);
		element ? (element.innerText = content) : 0;
	},
	setStyle: (element, style) => {
		if (element && style) {
			Object.assign(element.style, style);
		}
	},
	render: (parent, elements, clear = false) => {
		if (parent && elements) {
			if (clear) {
				Utils.clear(parent);
			}
			if (Array.isArray(elements)) {
				elements.map(ele => {
					parent.append(ele);
				});
			} else {
				parent.append(elements);
			}
		}
	},
};
export default Utils;
