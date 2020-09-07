module.exports = class CommandSet {
	constructor(localeInput, nameInput, descriptionInput, fileNamesInput, managerCommandsInput) {
		this.locale = localeInput;
		this.name = nameInput;
		this.description = descriptionInput;
		this.fileNames = fileNamesInput;
		this.managerCommands = managerCommandsInput;
	}
}