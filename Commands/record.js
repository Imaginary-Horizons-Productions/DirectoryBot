const Command = require('./../Classes/Command.js');
const { syncUserRolePlatform, saveUserDictionary } = require('./../helpers.js');

var command = new Command();
command.names = ["record", "log"];
command.summary = `Record your information for a platform`;
command.managerCommand = false;

command.help = (clientUser, state) => { // function for constructing examples with used overloads
    return `The *${state.messageArray[0]}* command adds your information for given platform so people can ask the bot for it. The message containing the command will be deleted for security purposes.\n\
Syntax: ${clientUser} \`${state.messageArray[0]} (platform) (code)\``;
}

command.execute = (receivedMessage, state, metrics) => {
    // Records a user's information for a given platform
    if (state.messageArray.length > 0) {
        if (state.messageArray.length > 1) {
            var platform = state.messageArray[0].toLowerCase();
            var codeArray = state.messageArray.slice(1);
            var friendcode = codeArray.join(" ");

            if (Object.keys(state.cachedGuild.platformsList).includes(platform)) { // Early out if platform is not being tracked
                if (state.cachedGuild.userDictionary[receivedMessage.author.id][platform]) {
                    state.cachedGuild.userDictionary[receivedMessage.author.id][platform].value = friendcode;
                    syncUserRolePlatform(receivedMessage.member, platform, state.cachedGuild);
                    saveUserDictionary(receivedMessage.guild.id, state.cachedGuild.userDictionary);
                    receivedMessage.channel.send(`${receivedMessage.author} has recorded a ${platform} ${state.cachedGuild.platformsList[platform].term}. Check it with "${receivedMessage.client.user} lookup ${receivedMessage.author} ${platform}".`);
                }
            } else {
                // Error Message
                receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`)
            }
        } else {
            // Error Message
            receivedMessage.author.send(`Please provide the information you would like to record.`);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please provide a platform for which to record your information for.`);
    }
}

module.exports = command;
