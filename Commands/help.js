const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { MessageEmbed } = require('discord.js');

var command = new Command("help", false, false, true);

command.execute = (receivedMessage, state, locale) => {
	//TODO if placed with other dependencies, commandDictionary will be fetched before it's done being set
	const { commandSets, commandDictionary } = require(`./CommandsList.js`);

	// Provides a summary about bot commands, or details about a given command
	if (state.messageArray.length > 0) {
		let commandName = state.messageArray[0];
		var lookedUpCommand = commandDictionary[commandName];
		if (lookedUpCommand) {
			if (state.botManager || !lookedUpCommand.managerCommand) {
				receivedMessage.author.send(lookedUpCommand.help(receivedMessage.client.user.displayAvatarURL(), state, locale, receivedMessage.guild.name, lookedUpCommand.module))
					.catch(console.error);
			} else {
				// Error Message
				receivedMessage.author.send(getString(locale, command.module, "errorNotManager").addVariables({
					"role": state.managerRoleID ? ` or the @${receivedMessage.guild.roles.resolve(state.managerRoleID).name} role` : ``
				})).catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, "DirectoryBot", "errorBadCommand").addVariables({
				"commandName": state.command,
				"botNickname": receivedMessage.client.user
			})).catch(console.error);
		}
	} else {
		commandSets.forEach(commandSet => {
			if (state.botManager || !commandSet.managerCommand) {
				var embed = new MessageEmbed().setColor('6b81eb')
					.setAuthor(getString(locale, "DirectoryBot", "studioName"), `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
					.setTitle(getString(locale, commandSet.module, "title"))
					.setDescription(getString(locale, commandSet.module, "description"))
					.setFooter(getString(locale, "DirectoryBot", "footerText"), receivedMessage.client.user.displayAvatarURL())
					.setTimestamp();
				commandSet.fileNames.forEach(filename => {
					const command = filename.splice(0, -5);
					embed.addField('**' + getString(locale, command, "names").join(', ') + '**', getString(locale, command, "summary"))
				})

				receivedMessage.author.send(embed)
					.catch(console.error);
			}
		})
	}
}

module.exports = command;
