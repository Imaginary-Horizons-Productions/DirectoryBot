const Command = require('./../Classes/Command.js');
const { MessageEmbed } = require('discord.js');
const { getString, supportedLocales } = require('./../Localizations/localization.js');
const { guildLocales, tipBuilder } = require('./../helpers.js');

var command = new Command("setlocale", true, false, false);

// Overload help command to add supported locales to field on execute
command.help = (avatarURL, guildID, locale, guildName, module) => {
	var tip = tipBuilder(locale);
	let embed = new MessageEmbed().setAuthor(tip.text, avatarURL, tip.url)
		.setTitle(getString(locale, "DirectoryBot", "directoryBotCommand") + getString(locale, command.module, "names").join(', '))
		.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/765061579619565588/magnifying-glass.png')
		.setDescription(getString(locale, command.module, "description"))
		.setFooter(getString(locale, "DirectoryBot", "footerText"), `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `);

	let headers = getString(locale, command.module, "headers");
	let texts = getString(locale, command.module, "texts");
	for (var i = 0; i < headers.length; i++) {
		embed.addField(headers[i], texts[i].addVariables({
			"supportedLocales": supportedLocales.join(', ')
		}));
	}

	return embed;
}

command.execute = (receivedMessage, state, locale) => {
	// Set the default locale for the guild the command was received in
	let localeInput = state.messageArray[0];
	if (localeInput) {
		if (supportedLocales.includes(localeInput)) {
			guildLocales[receivedMessage.guild.id] = localeInput;
			receivedMessage.channel.send(getString(locale, command.module, "successMessage").addVariables({
				"locale": state.messageArray[0]
			})).catch(console.error);
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, command.module, "errorBadLocale").addVariables({
				"supportedLocales": supportedLocales.join(', ')
			})).catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, command.module, "errorNoLocale").addVariables({
			"server": receivedMessage.guild.name
		})).catch(console.error);
	}
}

module.exports = command;
