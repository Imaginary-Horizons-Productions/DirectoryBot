const { MessageEmbed } = require('discord.js');
const { tipBuilder } = require('../helpers.js');
const { getString } = require('./../Localizations/localization.js');

module.exports = class Command {
	constructor(moduleInput, managerCommandInput, premiumCommandInput, dmCommandInput) {
		this.module = moduleInput;
		this.managerCommand = managerCommandInput;
		this.premiumCommand = premiumCommandInput;
		this.dmCommand = dmCommandInput;
	}

	help(avatarURL, guildID, locale, guildName, module) {
		var tip = tipBuilder(locale);
		let embed = new MessageEmbed().setAuthor(tip.text, avatarURL, tip.url)
			.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/765061579619565588/magnifying-glass.png')
			.setTitle(getString(locale, "DirectoryBot", "directoryBotCommand") + getString(locale, module, "names").join(', '))
			.setDescription(getString(locale, module, "description"))
			.setFooter(getString(locale, "DirectoryBot", "footerText"), `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `);

		embed.addField(getString(locale, "DirectoryBot", "commandProperties"), getString(locale, "DirectoryBot", "propertiesText").addVariables({
			"premium": this.premiumCommand ? ":white_check_mark:" : ":no_entry_sign:",
			"manager": this.managerCommand ? ":no_entry_sign:" : ":white_check_mark:",
			"dmCommand": this.dmCommand ? ":white_check_mark:" : ":no_entry_sign:"
		}));
		let headers = getString(locale, module, "headers");
		let texts = getString(locale, module, "texts");
		for (var i = 0; i < headers.length; i++) {
			embed.addField(headers[i], texts[i]);
		}

		return embed;
	}

	execute(receivedMessage, state, locale) { }
}
