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
		let titleString = getString(locale, command.module, "embedTitle");
		let descriptionString = getString(locale, command.module, "embedDescription");
		let footerString = getString(locale, "DirectoryBot", "footerText");
		let totalCharacterCount = "Imaginary Horizons Productions".length + titleString.length + descriptionString.length + footerString.length;
		var embed = new MessageEmbed().setColor('6b81eb')
			.setAuthor("Imaginary Horizons Productions", `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/FJ8JGq2`)
			.setTitle(titleString)
			.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/765059662268727326/info.png')
			.setDescription(descriptionString)
			.setFooter(footerString, receivedMessage.client.user.displayAvatarURL())
			.setTimestamp();
		for (commandSet of commandSets) {
			if (state.botManager || !commandSet.managerCommand) {
				let commandSetText = getString(locale, commandSet.module, "description") + "\n";
				commandSet.fileNames.forEach(filename => {
					commandSetText += `\n__*${getString(locale, filename.slice(0, -3), "names")[0]}*__ ${getString(locale, filename.slice(0, -3), "summary")}`
				})
				totalCharacterCount += commandSetText.length;

				if (commandSetText.length > 1024 || totalCharacterCount > 6000) {
					embed = {
						files: [{
							attachment: "README.md",
							name: "commands.txt"
						}]
					}
				} else {
					embed.addField(getString(locale, commandSet.module, "title"), commandSetText);
				}
			}
		}
		receivedMessage.author.send(embed)
			.catch(console.error);
	}
}

module.exports = command;
