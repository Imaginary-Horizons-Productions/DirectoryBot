module.exports = class CommandSet {
	constructor(nameInput, descriptionInput, fileNamesInput, managerCommandsInput) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.fileNames = fileNamesInput;
		this.managerCommands = managerCommandsInput;
	}
}