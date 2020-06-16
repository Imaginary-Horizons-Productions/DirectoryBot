const Command = require('./../Classes/Command.js');

var command = new Command();
command.names = [/* list of overloads goes here*/];
command.summary = ``; // help summary text
command.managerCommand = false; // bool for if manager-only command

command.help = (clientUser, state) => { // function for constructing examples with used overloads
	return ``; // help string
	// REMINDER! update readme
}

command.execute = (receivedMessage, state, metrics) => {
	// Command specifications go here
}

module.exports = command;
