const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { MessageEmbed } = require('discord.js');

var command = new Command("support", false, false, true);

// Overwrite detailed help description with executing the command
command.help = (avatarURL, guildID, locale, guildName, module) => {
	return supportBuilder(avatarURL, locale);
}

command.execute = (receivedMessage, state, locale) => {
	// Lists ways users can support development
	receivedMessage.author.send(supportBuilder(receivedMessage.client.user.displayAvatarURL(), locale))
		.catch(console.error);
}

module.exports = command;

function supportBuilder(footerURL, locale) {
	return new MessageEmbed().setColor('6b81eb')
		.setAuthor("Imaginary Horizons Productions", `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
		.setTitle(getString(locale, command.module, "supportingDirectoryBot"))
		.setDescription(getString(locale, command.module, "embedDescription"))
		.addField(getString(locale, command.module, "vote"), getString(locale, command.module, "voteText"))
		.addField(getString(locale, command.module, "refer"), getString(locale, command.module, "referText"))
		.addField(getString(locale, command.module, "contribute"), getString(locale, command.module, "contributeText"))
		.addField(getString(locale, command.module, "social"), getString(locale, command.module, "socialText"))
		.addField(getString(locale, command.module, "patron"), getString(locale, command.module, "patronText"))
		.setFooter(getString(locale, command.module, "thanks"), footerURL)
		.setTimestamp();
}
