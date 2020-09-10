const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { platformsBuilder } = require('./../helpers.js');

var command = new Command(false, false, false);
command.names = {
	"en_US": ["platforms"]
}

command.summary = {
	"en_US": "List the games/services DirectoryBot can be used to record or retrieve information for (using help on this command uses the command)"
}

// Description and Sections set for README generation
command.description = {
	"en_US": "This command lists the games/services DirectoryBot can be used to record or retrieve information for. Using `help` on this command uses the command."
}

command.sections = {
	"en_US": [
		new Section("Usage", "`@DirectoryBot platforms`")
	]
}

// Overwrite detailed help description with executing the command
command.help = (avatarURL, state, locale, guildName) => {
	return platformsBuilder(guildName, state.platformsList, locale);
}

command.execute = (receivedMessage, state, locale) => {
	// List the platforms being tracked in the guild
	receivedMessage.channel.send(platformsBuilder(receivedMessage.guild.name, state.platformsList, locale))
		.catch(console.error);
}

module.exports = command;
