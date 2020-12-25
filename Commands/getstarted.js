const Command = require('../Classes/Command.js');
const { getString } = require('../Localizations/localization.js');
const { MessageEmbed } = require('discord.js');

var command = new Command("getstarted", false, false, true);

command.help = (avatarURL, guildID, locale, guildName, module) => {
	return getStartedBuilder(avatarURL, locale, true);
}

command.execute = (receivedMessage, state, locale) => {
	// Provide author with steps for getting started with DirectoryBot
	receivedMessage.author.send(getStartedBuilder(receivedMessage.client.user.displayAvatarURL(), locale, state.botManager))
		.catch(console.error);
}

module.exports = command;

function getStartedBuilder(footerURL, locale, botManager) {
	let embed = new MessageEmbed().setColor('6b81eb')
		.setAuthor("Imaginary Horizons Productions", `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/FJ8JGq2`)
		.setTitle(getString(locale, command.module, "embedTitle"))
		.setThumbnail(footerURL)
		.setFooter(getString(locale, "DirectoryBot", "footerText"), footerURL)
		.setTimestamp();

	if (botManager) {
		embed.setDescription(getString(locale, command.module, "managerDescription"))
			.addField(getString(locale, command.module, "permissionsRole"), getString(locale, command.module, "permissionsRoleText"))
			.addField(getString(locale, command.module, "managerRole"), getString(locale, command.module, "managerRoleText"))
			.addField(getString(locale, command.module, "roles"), getString(locale, command.module, "rolesText"))
			.addField("\u200B", getString(locale, command.module, "managerDivider"));
	} else {
		embed.setDescription(getString(locale, command.module, "nonmanagerDescription"));
	}

	embed.addField(getString(locale, command.module, "record"), getString(locale, command.module, "recordText"))
		.addField(getString(locale, command.module, "platforms"), getString(locale, command.module, "platformsText"))
		.addField(getString(locale, command.module, "help"), getString(locale, command.module, "helpText"));
	return embed;
}
