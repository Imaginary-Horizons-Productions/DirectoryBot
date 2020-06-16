const Command = require('./../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

var help = new Command();
help.names = ["help", "commands"];
help.summary = `You can type \`@DirectoryBot help\` followed by one of those for specific instructions.`;
help.managerCommand = false;

help.help = (clientUser, state) => {
    return `The **${state.messageArray[0]}** command lists all of ${clientUser}'s commands.
Syntax: ${clientUser}\` ${state.messageArray[0]}\`

Putting a command as an input will give details on that command and usage examples.
Syntax: ${clientUser}\` ${state.messageArray[0]} (command)\``;
}

help.execute = (receivedMessage, state, metrics) => {
    //TODO if placed with other dependencies, commandDictionary will be fetched before it's done being set
    const { commandList, commandDictionary } = require(`./CommandsList.js`);

    // Provides a summary about bot commands, or details about a given command
    if (state.messageArray.length > 0) {
        let commandName = state.messageArray[0];
        var lookedUpCommand = commandDictionary[commandName];
        if (lookedUpCommand) {
            if (state.botManager || !lookedUpCommand.managerCommand) {
                receivedMessage.author.send(lookedUpCommand.help(receivedMessage.client.user, state))
                    .catch(console.error);
            } else {
                receivedMessage.author.send(`You need a role with the administrator flag${state.cachedGuild.managerRoleID != "" ? ` or the @${receivedMessage.guild.roles.resolve(state.cachedGuild.managerRoleID).name} role` : ``} to view manager commands.`)
                    .catch(console.error);
            }
        } else {
            receivedMessage.author.send(`**${commandName}** does not appear to be a ${receivedMessage.client.user} command. Please check for typos!`)
                .catch(console.error);
        }
    } else {
        Object.keys(commandList).forEach(commandSet => {
            if (state.botManager || commandSet == "General Commands" || commandSet == "Time Zone Commands" || commandSet == "Stream Commands") {
                var embed = new MessageEmbed().setColor('6b81eb')
                    .setAuthor(`Imaginary Horizons Productions`, `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
                    .setTitle(commandSet)
                    .setDescription(`To interact with ${receivedMessage.client.user}, mention the bot then type one of these commands:`)
                    .setFooter(`Support development with "@DirectoryBot support"`, receivedMessage.client.user.displayAvatarURL())
                    .setTimestamp();
                commandList[commandSet].forEach(filename => {
                    const command = require(`./${filename}`)
                    embed.addField('**' + command.names.join(', ') + '**', command.summary)
                })

                receivedMessage.author.send(embed)
                    .catch(console.error);
            }
        })
    }
}

module.exports = help;
