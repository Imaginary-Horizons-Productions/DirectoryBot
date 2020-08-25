const Command = require('./../Classes/Command.js');
const { platformsBuilder } = require('./../helpers.js');

var command = new Command(["platforms"], `List the games/services DirectoryBot can be used to record or retrieve information for (using help on this command uses the command)`, false, false, false)
	// Description and Sections set for README generation
	.addDescription(`This command lists the games/services DirectoryBot can be used to record or retrieve information for. Using \`help\` on this command uses the command.`)
	.addSection(`Usage`, `\`@DirectoryBot platforms\``);

// Overwrite detailed help description with executing the command
command.help = (clientUser, state) => {
	return platformsBuilder(state.platformsList);
}

command.execute = (receivedMessage, state, metrics) => {
	// List the platforms being tracked in the guild
	receivedMessage.channel.send(platformsBuilder(state.platformsList))
		.catch(console.error);
}

module.exports = command;
