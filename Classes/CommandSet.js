module.exports = class CommandSet {
	constructor(cullForNonmanagers, fileNamesInput) {
		this.managerCommands = cullForNonmanagers;
		this.name = {};
		this.description = {};
		this.fileNames = fileNamesInput;
	}
}