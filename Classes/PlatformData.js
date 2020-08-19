module.exports = class PlatformData {
	//TODO have multiple entries per platform
	constructor(termInput = "username", descriptionInput = "") {
		this.term = termInput;
		this.description = descriptionInput;
		this.role;
	}
}
