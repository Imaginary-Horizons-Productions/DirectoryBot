const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { directories } = require('../helpers.js');
const { MessageEmbed } = require('discord.js');

var command = new Command("help", false, false, true);

command.execute = (receivedMessage, state, locale) => {
	//TODO if placed with other dependencies, commandDictionary will be fetched before it's done being set
	const { commandSets, commandDictionary } = require(`./CommandsList.js`);

	// Provides a summary about bot commands, or details about a given command
	if (state.messageArray.length > 0) {
		let commandName = state.messageArray[0].toLowerCase();
		var lookedUpCommand = commandDictionary[commandName];
		if (receivedMessage.guild) {
			var { id: guildID, name: guildName } = receivedMessage.guild;
		}

		if (lookedUpCommand) {
			let commandLocale = lookedUpCommand.locale || locale;
			receivedMessage.author.send(lookedUpCommand.help(receivedMessage.client.user.displayAvatarURL(), guildID, commandLocale, guildName, lookedUpCommand.module))
				.catch(console.error);
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, "DirectoryBot", "errorBadCommand").addVariables({
				"commandName": state.messageArray[0],
				"botNickname": receivedMessage.client.user
			})).catch(console.error);
		}
	} else {
		commandSets.forEach(commandSet => {
			if (state.botManager || !commandSet.managerCommand) {
				var embed = new MessageEmbed().setColor('6b81eb')
					.setAuthor("Imaginary Horizons Productions", `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/FJ8JGq2`)
					.setTitle(getString(locale, commandSet.module, "title"))
					.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/765059662268727326/info.png')
					.setDescription(getString(locale, commandSet.module, "description"))
					.setFooter(getString(locale, "DirectoryBot", "footerText"), receivedMessage.client.user.displayAvatarURL())
					.setTimestamp();
				commandSet.fileNames.forEach(filename => {
					embed.addField('**' + getString(locale, filename.slice(0, -3), "names").join(', ') + '**', getString(locale, filename.slice(0, -3), "summary"))
				})

				receivedMessage.author.send(embed)
					.catch(console.error);
			}
		})
	}
}

module.exports = command;
