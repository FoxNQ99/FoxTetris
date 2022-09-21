class Cleaner {
	constructor() {}
	static Text(text) {
		const rgStringNum = /[a-zA-Z0-9]*/gm;
		let result = text.match(rgStringNum).join("");
		if (result.length > 15) {
			result.length = 15;
		}
		return result;
	}
}
export default Cleaner;
