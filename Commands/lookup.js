const Command = require('./../Classes/Command.js');
const { MessageMentions } = require('discord.js');
const { platformsBuilder, millisecondsToHours } = require('./../helpers.js');

var lookup = new Command();
lookup.names = ["lookup"];
lookup.summary = `Look up someone else's information if they've recorded it`;
lookup.managerCommand = false;

lookup.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command tells you everyone's information associted with the given platform.
Syntax: ${clientUser} \`${state.messageArray[0]} (platform)\`

You can limit your results to a set of users by mentioning them at the end of the command.
Syntax: ${clientUser} \`${state.messageArray[0]} (platform) (user set)\n\n` + platformsBuilder(state.cachedGuild.platformsList);
}

lookup.execute = (receivedMessage, state, metrics) => {
    // Looks up platform data for the server or a set of users and sends it to the command user
    if (state.messageArray.length > 0) {
        var platform = state.messageArray.filter(word => !word.match(MessageMentions.USERS_PATTERN))[0].toLowerCase();

        if (Object.keys(state.cachedGuild.platformsList).includes(platform)) {
            var text = `Here are all the ${platform} ${state.cachedGuild.platformsList[platform].term}s in ${receivedMessage.guild}'s ${receivedMessage.client.user}:\n`;
            let userList = [];

            receivedMessage.mentions.members.array().forEach(member => {
                if (member.id != receivedMessage.client.user.id) {
                    userList.push(member.id);
                }
            });
            if (userList.length == 0) {
                userList = Object.keys(state.cachedGuild.userDictionary);
            }

            userList.forEach(userID => {
                if (!(state.cachedGuild.blockDictionary[userID] && state.cachedGuild.blockDictionary[userID].includes(receivedMessage.author.id))) {
                    if (state.cachedGuild.userDictionary[userID] && state.cachedGuild.userDictionary[userID][platform]) {
                        if (state.cachedGuild.userDictionary[userID][platform].value) {
                            text += `${receivedMessage.guild.members.resolve(userID).displayName}: ${state.cachedGuild.userDictionary[userID][platform].value}`;
                        }
                    }
                }
            })
            text += `\n\nThis message will expire in about ${millisecondsToHours(state.cachedGuild.infoLifetime)}.`;
            if (text.length < 2001) {
                receivedMessage.author.send(text).then(sentMessage => {
                    sentMessage.setToExpire(state.cachedGuild, receivedMessage.guild.id, `Your lookup of ${receivedMessage.guild.name}'s ${platform} ${state.cachedGuild.platformsList[platform].term} has expired.`);
                }).catch(console.error);
            } else {
                // Error Message
                receivedMessage.author.send(`Your lookup of ${receivedMessage.guild.name}'s ${platform} ${state.cachedGuild.platformsList[platform].term} is too long for a single message, please limit your search (2,000 characters max).`)
                    .catch(console.error);
            }
        } else {
            // Error Message
            receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`)
                .catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please provide a platform in which to look up information.`)
            .catch(console.error);
    }
}

module.exports = lookup;
