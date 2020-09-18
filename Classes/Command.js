const { MessageEmbed } = require('discord.js');
const { getString } = require('./../Localizations/localization.js');

module.exports = class Command {
	constructor(moduleInput, managerCommandInput, premiumCommandInput, dmCommandInput) {
		this.module = moduleInput;
		this.managerCommand = managerCommandInput;
		this.premiumCommand = premiumCommandInput;
		this.dmCommand = dmCommandInput;
	}

	help(avatarURL, state, locale, guildName, module) {
		let embed = new MessageEmbed().setAuthor(getString(locale, "DirectoryBot", "studioName"), `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
			.setTitle(getString(locale, "DirectoryBot", "directoryBotCommand") + getString(locale, module, "names").join(', '))
			.setDescription(getString(locale, module, "description"))
			.setFooter(getString(locale, "DirectoryBot", "footerText"), avatarURL);

		let headers = getString(locale, module, "headers");
		let texts = getString(locale, module, "texts");
		for (var i = 0; i < headers.length; i++) {
			embed.addField(headers[i], texts[i]);
		}

		return embed;
	}

	execute(receivedMessage, state, locale) { }
}
