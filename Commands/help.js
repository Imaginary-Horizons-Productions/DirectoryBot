const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { errorBadCommand, studioName, footerText } = require('./../localization.js');
const { MessageEmbed } = require('discord.js');

var command = new Command(false, false, true);
command.names = {
	"en_US": ["help", "commands"]
}

command.summary = {
	"en_US": `You can type \`@DirectoryBot help\` followed by a command for more detailed information on that command`
}

command.description = {
	"en_US": `This command provides details on DirectoryBot commands by either listing all commands available to you, or providing details on a specific command.`
}

command.sections = {
	"en_US": [
		new Section("List all commands", "`@DirectoryBot help`"),
		new Section("Get details on a specific command", "`@DirectoryBot help (command)`")
	]
}


command.execute = (receivedMessage, state, locale) => {
	//TODO if placed with other dependencies, commandDictionary will be fetched before it's done being set
	const { commandSets, commandDictionary } = require(`./CommandsList.js`);

	// Provides a summary about bot commands, or details about a given command
	if (state.messageArray.length > 0) {
		let commandName = state.messageArray[0];
		var lookedUpCommand = commandDictionary[commandName];
		if (lookedUpCommand) {
			if (state.botManager || !lookedUpCommand.managerCommand) {
				receivedMessage.author.send(lookedUpCommand.help(receivedMessage.client.user.displayAvatarURL(), state, locale, receivedMessage.guild.name))
					.catch(console.error);
			} else {
				// Error Message
				receivedMessage.author.send(errorNotManager[locale].addVariables({
					"role": state.managerRoleID ? ` or the @${receivedMessage.guild.roles.resolve(state.managerRoleID).name} role` : ``
				})).catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(errorBadCommand[locale].addVariables({
				"commandName": state.command,
				"botNickname": receivedMessage.client.user
			})).catch(console.error);
		}
	} else {
		commandSets.forEach(commandSet => {
			if (state.botManager || !commandSet.managerCommand) {
				var embed = new MessageEmbed().setColor('6b81eb')
					.setAuthor(studioName[locale], `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
					.setTitle(commandSet.name)
					.setDescription(commandSet.description)
					.setFooter(footerText[locale], receivedMessage.client.user.displayAvatarURL())
					.setTimestamp();
				commandSet.fileNames.forEach(filename => {
					const command = require(`./${filename}`)
					embed.addField('**' + command.names.join(', ') + '**', command.summary)
				})

				receivedMessage.author.send(embed)
					.catch(console.error);
			}
		})
	}
}

let errorNotManager = {
	"en_US": "You need a role with the administrator flag${role} to view manager commands."
}

module.exports = command;
