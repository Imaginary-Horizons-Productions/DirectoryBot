const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');

var command = new Command("", false, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Command specifications go here
}

module.exports = command;
