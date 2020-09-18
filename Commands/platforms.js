const Command = require('./../Classes/Command.js');
const { platformsBuilder } = require('./../helpers.js');

var command = new Command("platforms", false, false, false);

// Overwrite detailed help description with executing the command
command.help = (avatarURL, state, locale, guildName, module) => {
	return platformsBuilder(guildName, state.platformsList, locale);
}

command.execute = (receivedMessage, state, locale) => {
	// List the platforms being tracked in the guild
	receivedMessage.channel.send(platformsBuilder(receivedMessage.guild.name, state.platformsList, locale))
		.catch(console.error);
}

module.exports = command;
