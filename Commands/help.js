const Command = require('./../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

var command = new Command(["help", "commands"], `You can type \`@DirectoryBot help\` followed by a command for more detailed information on that command`, false, false, true)
	.addDescription(`This command provides details on DirectoryBot commands by either listing all commands available to you, or providing details on a specific command.`)
	.addSection(`List all commands`, `\`@DirectoryBot help\``)
	.addSection(`Get details on a specific command`, `\`@DirectoryBot help (command)\``);

command.execute = (receivedMessage, state, metrics) => {
	//TODO if placed with other dependencies, commandDictionary will be fetched before it's done being set
	const { commandSets, commandDictionary } = require(`./CommandsList.js`);

	// Provides a summary about bot commands, or details about a given command
	if (state.messageArray.length > 0) {
		let commandName = state.messageArray[0];
		var lookedUpCommand = commandDictionary[commandName];
		if (lookedUpCommand) {
			if (state.botManager || !lookedUpCommand.managerCommand) {
				receivedMessage.author.send(lookedUpCommand.help(receivedMessage.client.user, state))
					.catch(console.error);
			} else {
				// Error Message
				receivedMessage.author.send(`You need a role with the administrator flag${state.cachedGuild.managerRoleID ? ` or the @${receivedMessage.guild.roles.resolve(state.cachedGuild.managerRoleID).name} role` : ``} to view manager commands.`)
					.catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(`**${commandName}** does not appear to be a ${receivedMessage.client.user} command. Please check for typos!`)
				.catch(console.error);
		}
	} else {
		commandSets.forEach(commandSet => {
			if (state.botManager || !commandSet.managerCommand) {
				var embed = new MessageEmbed().setColor('6b81eb')
					.setAuthor(`Imaginary Horizons Productions`, `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
					.setTitle(commandSet.name)
					.setDescription(commandSet.description)
					.setFooter(`Support development with "@DirectoryBot support"`, receivedMessage.client.user.displayAvatarURL())
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

module.exports = command;
