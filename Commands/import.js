const Command = require('./../Classes/Command.js');
const { MessageMentions } = require('discord.js');
const { saveUserDictionary, guildDictionary } = require('./../helpers.js');

var command = new Command();
command.names = ['import'];
command.summary = `Copies your information from a source server to a destination server`;
command.managerCommand = false;

command.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command copies your information for matching platforms from a given server. There are two ways to indicate which server to import from: by mentioning a channel from that server, or by mentioning the server's snowflake.
Syntax: ${clientUser} \`${state.messageArray[0]} (channel mention or server snowflake)\`

To get a channel mention, start a message in the server you want to import from. Start with #, then autocomplete. You can then copy-paste the blue link into your command in the destination server.

To get a server's snowflake, first activate Developer Mode in your User Settings. Then you can right-click on the source server and select "Copy ID" from the drop-down menu.`;
}

command.execute = (receivedMessage, state, metrics) => {
    // Copy information from the given guild to the current guild for any platforms with matching names
    let sourceGuildID;

    for (const argument of state.messageArray) {
        if (!isNaN(parseInt(argument))) {
            sourceGuildID = argument;
            break;
        } else if (argument.match(MessageMentions.CHANNELS_PATTERN)) {
            sourceGuildID = receivedMessage.mentions.channels.array()[0].guild.id;
            break;
        }
    }

    if (sourceGuildID) {
        if (sourceGuildID != receivedMessage.guild.id) {
            let sourceGuild = guildDictionary[sourceGuildID];
            if (sourceGuild) {
                let sourceDictionary = sourceGuild.userDictionary[receivedMessage.author.id];
                if (sourceDictionary) {
                    let feedbackText = "Your import succeeded. Here are the platforms that have been updated:";
                    Object.keys(sourceDictionary).forEach(platform => {
                        if (Object.keys(state.cachedGuild.platformsList).includes(platform) && !state.cachedGuild.userDictionary[receivedMessage.author.id][platform].value && sourceDictionary[platform] && sourceDictionary[platform].value) {
                            state.cachedGuild.userDictionary[receivedMessage.author.id][platform].value = sourceDictionary[platform].value;
                            feedbackText += `\n${platform}: ${sourceDictionary[platform].value}`
                        }
                    })
                    receivedMessage.member.addPlatformRoles(state.cachedGuild);

                    saveUserDictionary(receivedMessage.guild.id, state.cachedGuild.userDictionary);
                    receivedMessage.author.send(feedbackText)
                        .catch(console.error);
                } else {
                    // Error Message
                    receivedMessage.author.send(`You do not seem to have any information recorded in the source server.`)
                        .catch(console.error);
                }
            } else {
                // Error Message
                receivedMessage.author.send(`Source server for import does not seem to be running ${receivedMessage.client.user}.`)
                    .catch(console.error);
            }
        } else {
            // Error Message
            receivedMessage.author.send(`Source server for import cannot be the same as the destination server.`)
                .catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Source server for import could not be parsed.`)
            .catch(console.error);
    }
}

module.exports = command;
