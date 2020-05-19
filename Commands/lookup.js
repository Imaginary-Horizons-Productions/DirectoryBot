const Command = require('./../Classes/Command.js');
const { millisecondsToHours } = require('./../helpers.js');

var command = new Command();
command.names = ["lookup"];
command.summary = `Look up someone else's information if they've recorded it`;
command.managerCommand = false;

command.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command tells you everyone's information associted with the given platform.\n\
Syntax: ${clientUser} \`${state.messageArray[0]} (platform)\`\n\
you can limit your results to a set of users by mentioning them at the end of the command.\n\
Syntax: ${client.user} \`${state.messageArray[0]} (platform) (user set)`;
}

command.execute = (receivedMessage, state, metrics) => {
    // Looks up platform data for the server or a set of users and sends it to the command user
    if (state.messageArray.length > 0) {
        var platform = state.messageArray[0].toLowerCase();

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

            userList.forEach(user => {
                if (state.cachedGuild.userDictionary[user] && state.cachedGuild.userDictionary[user][platform]) {
                    if (state.cachedGuild.userDictionary[user][platform].value) {
                        text += `${receivedMessage.guild.members.resolve(user).displayName}: ${state.cachedGuild.userDictionary[user][platform].value}`;
                    }
                }
            })
            text += `\n\nThis message will expire in about ${millisecondsToHours(state.cachedGuild.infoLifetime)}.`;
            if (text.length < 2001) {
                receivedMessage.author.send(text).then(sentMessage => {
                    setTimeout(function () {
                        sentMessage.edit(`Your lookup of ${receivedMessage.guild.name}'s ${platform} ${state.cachedGuild.platformsList[platform].term} has expired.`);
                    }, state.cachedGuild.infoLifetime);
                }).catch(console.error);
            } else {
                // Error Message
                receivedMessage.author.send(`Your lookup of ${receivedMessage.guild.name}'s ${platform} ${state.cachedGuild.platformsList[platform].term} is too long for a single message, please limit your search (2,000 characters max).`);
            }
        } else {
            // Error Message
            receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`)
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please provide a platform in which to look up information.`)
    }
}

module.exports = command;
