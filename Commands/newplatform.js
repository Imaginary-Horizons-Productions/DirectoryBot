const Command = require('./../Classes/Command.js');
const PlatformData = require('./../Classes/PlatformData.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { savePlatformsList } = require('./../helpers.js');

var command = new Command();
command.names = ["newplatform", "addplatform"];
command.summary = `Setup a new game/service for users to record or retrieve information for`;
command.managerCommand = true;

command.help = (clientUser, state) => { // function for constructing examples with used overloads
    return `The *${state.messageArray[0]}* command sets up a new game/service for users to record and retrieve information. Optionally, you can set a term to call the information that is being stored (default is "username").\n\
Syntax: ${clientUser} \`${state.messageArray[0]} (platform name) (information term)\``;
}

command.execute = (receivedMessage, state, metrics) => {
    // Adds a new platform to track
    if (state.messageArray.length > 0) {
        let platform = state.messageArray[0].toLowerCase();
        let term = state.messageArray[1];

        if (!state.cachedGuild.platformsList[platform]) {
            state.cachedGuild.platformsList[platform] = new PlatformData();
            if (term) {
                state.cachedGuild.platformsList[platform].term = term;
            }
            Object.keys(state.cachedGuild.userDictionary).forEach(userID => {
                state.cachedGuild.userDictionary[userID][platform] = new FriendCode();
            })
            receivedMessage.channel.send(`${state.messageArray[0]} ${state.cachedGuild.platformsList[platform].term}s can now be recorded and retrieved.`);
            savePlatformsList(receivedMessage.guild.id, state.cachedGuild.platformsList);
        } else {
            // Error Message
            receivedMessage.author.send(`${state.messageArray[0]} ${state.cachedGuild.platformsList[platform].term}s can already be recorded and retrieved.`);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please provide a name for the new platform.`);
    }
}

module.exports = command;
