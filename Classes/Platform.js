module.exports = class Platform {
	//TODO have multiple entries per platform
	constructor(termInput = "username", descriptionInput = "") {
		this.term = termInput;
		this.description = descriptionInput;
		this.role;
	}
}
