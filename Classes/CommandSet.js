module.exports = class CommandSet {
	constructor(moduleInput, cullForNonmanagers, fileNamesInput) {
		this.module = moduleInput;
		this.managerCommands = cullForNonmanagers;
		this.fileNames = fileNamesInput;
	}
}