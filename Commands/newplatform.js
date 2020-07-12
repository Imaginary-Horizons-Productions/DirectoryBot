const Command = require('./../Classes/Command.js');
const PlatformData = require('./../Classes/PlatformData.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { savePlatformsList } = require('./../helpers.js');

var newplatform = new Command();
newplatform.names = ["newplatform", "addplatform"];
newplatform.summary = `Setup a new game/service for users to record or retrieve information for`;
newplatform.managerCommand = true;

newplatform.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command sets up a new game/service for users to record and retrieve information. Optionally, you can set a term to call the information that is being stored (default is "username"). Additionally, you can set an optional description to be displayed when the lookup command is used on the platform.
Syntax: ${clientUser} \`${state.messageArray[0]} (platform name) (information term)\``;
}

newplatform.execute = (receivedMessage, state, metrics) => {
    // Adds a new platform to track
    if (state.messageArray.length > 0) {
        let messageArray = state.messageArray;
        let platform = messageArray.shift().toLowerCase();
        let term = messageArray.shift();
        let description = messageArray.join(' ');

        if (!state.cachedGuild.platformsList[platform]) {
            state.cachedGuild.platformsList[platform] = new PlatformData(term, description);
            Object.keys(state.cachedGuild.userDictionary).forEach(userID => {
                state.cachedGuild.userDictionary[userID][platform] = new FriendCode();
            })
            receivedMessage.channel.send(`${platform} ${state.cachedGuild.platformsList[platform].term}s can now be recorded and retrieved.`)
                .catch(console.error);
            savePlatformsList(receivedMessage.guild.id, state.cachedGuild.platformsList);
        } else {
            // Error Message
            receivedMessage.author.send(`${receivedMessage.guild} already has a platform named *${platform}*.`)
                .catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please provide a name for the new platform.`)
            .catch(console.error);
    }
}

module.exports = newplatform;
