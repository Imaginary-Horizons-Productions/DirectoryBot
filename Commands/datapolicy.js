const Command = require('../Classes/Command.js');
const { getString } = require('../Localizations/localization.js');
const { MessageEmbed } = require('discord.js');

var command = new Command("datapolicy", false, false, true);

command.help = (avatarURL, guildID, locale, guildName, module) => {
	return dataPolicyBuilder(locale, avatarURL);
}

command.execute = (receivedMessage, state, locale) => {
	// Tell the user what kinds of data DirectoryBot collects and how it's used
	receivedMessage.author.send(dataPolicyBuilder(locale, receivedMessage.client.user.avatarURL()))
		.catch(console.error);
}

module.exports = command;

function dataPolicyBuilder(locale, footerURL) {
	return new MessageEmbed().setColor(`6b81eb`)
	.setAuthor("Imaginary Horizons Productions", `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
	.setURL(`https://github.com/Imaginary-Horizons-Productions/DirectoryBot `)
	.setTitle(getString(locale, command.module, "embedTitle"))
	.setDescription(getString(locale, command.module, "embedDescription"))
	.addField(getString(locale, command.module, "collectionHeader"), getString(locale, command.module, "collectionText"))
	.addField(getString(locale, command.module, "usageHeader"), getString(locale, command.module, "usageText"))
	.setFooter(getString(locale, "DirectoryBot", "footerText"), footerURL)
	.setTimestamp();
}
