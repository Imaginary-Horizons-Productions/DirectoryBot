const Command = require('./../Classes/Command.js');
const { directories, platformsBuilder } = require('./../helpers.js');
const { getString } = require('./../Localizations/localization.js');

var command = new Command("platforms", false, false, false);

// Overwrite detailed help description with executing the command
command.help = (avatarURL, guildID, locale, guildName, module) => {
	if (guildID) {
		return platformsBuilder(guildName, directories[guildID].platformsList, locale);
	} else {
		return getString(locale, "DirectoryBot", "errorNotPMCommand").addVariables({
			"command": module
		});
	}
}

command.execute = (receivedMessage, state, locale) => {
	// List the platforms being tracked in the guild
	receivedMessage.channel.send(platformsBuilder(receivedMessage.guild.name, directories[receivedMessage.guild.id].platformsList, locale))
		.catch(console.error);
}

module.exports = command;
