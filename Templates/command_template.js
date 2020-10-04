const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localization/localization.js');

let commandLocale = '';
var command = new Command(commandLocale, [/* list of overloads goes here*/], getString('', commandLocale), false, false, false)
	.addDescription(getString('', commandLocale))
	.addSection(getString('', commandLocale), getString('', commandLocale));

command.execute = (receivedMessage, state, locale) => {
	// Command specifications go here
}

module.exports = command;
