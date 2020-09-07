const Command = require('./../Classes/Command.js');

var command = new Command([/* list of overloads goes here*/], /*help summary text*/``, false, false, false)
	.addDescription(``)
	.addSection(``, ``);

command.execute = (receivedMessage, state, locale) => {
	// Command specifications go here
}

module.exports = command;
