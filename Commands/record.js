const Command = require('./../Classes/Command.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { saveUserDictionary } = require('./../helpers.js');

var record = new Command();
record.names = ["record", "log"];
record.summary = `Record your information for a platform`;
record.managerCommand = false;

record.help = (clientUser, state) => { // function for constructing examples with used overloads
    return `The *${state.messageArray[0]}* command adds your information for given platform so people can ask the bot for it. The message containing the command will be deleted for security purposes. Discord's spoilers markdown (|| on both sides) is removed from code entry to allow hiding entry from mobile via spoilers markdown.
Syntax: ${clientUser} \`${state.messageArray[0]} (platform) (code)\``;
}

record.execute = (receivedMessage, state, metrics) => {
    // Records a user's information for a given platform
    var platform = state.messageArray[0];
    if (platform) {
        platform = platform.toLowerCase();
        if (state.messageArray.length > 1) {
            var codeArray = state.messageArray.slice(1);
            let spoilerMarkdown = /\|\|/g;
            let friendcode = codeArray.join(" ").replace(spoilerMarkdown, '');

            if (Object.keys(state.cachedGuild.platformsList).includes(platform)) { // Early out if platform is not being tracked
                if (!state.cachedGuild.userDictionary[receivedMessage.author.id][platform]) {
                    state.cachedGuild.userDictionary[receivedMessage.author.id][platform] = new FriendCode();
                }

                state.cachedGuild.userDictionary[receivedMessage.author.id][platform].value = friendcode;
                receivedMessage.member.addPlatformRoles(state.cachedGuild);
                receivedMessage.delete().then(message => message.channel.send(`${message.author} has recorded a ${platform} ${state.cachedGuild.platformsList[platform].term}. Check it with "${message.client.user} lookup ${message.author} ${platform}".`)
                    .catch(console.error));
                saveUserDictionary(receivedMessage.guild.id, state.cachedGuild.userDictionary);
            } else {
                // Error Message
                receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`)
                    .catch(console.error);
            }
        } else {
            // Error Message
            receivedMessage.author.send(`Please provide the information you would like to record.`)
                .catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please provide a platform for which to record your information for.`)
            .catch(console.error);
    }
}

module.exports = record;
