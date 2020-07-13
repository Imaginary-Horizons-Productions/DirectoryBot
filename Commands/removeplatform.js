const Command = require('./../Classes/Command.js');
const { savePlatformsList } = require('./../helpers.js');

var removeplatform = new Command();
removeplatform.names = ["removeplatform"];
removeplatform.summary = `Stop recording and distributing user information for a game/service`;
removeplatform.managerCommand = true;

removeplatform.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command specifies a platform for ${clientUser} to stop recording and distributing information for. Note: this command does not remove roles associated with platforms in case someone has that role but wasn't given it by ${client.user}.
Syntax: ${clientUser} \`${state.messageArray[0]} (platform to remove)\``;
}

removeplatform.execute = (receivedMessage, state, metrics) => {
    // Removes the given platform
    if (state.messageArray.length > 0) {
        let platform = state.messageArray[0].toLowerCase();

        if (state.cachedGuild.platformsList[platform]) {
            Object.keys(state.cachedGuild.userDictionary).forEach(userID => {
                if (state.cachedGuild.platformsList[platform].roleID) {
                    receivedMessage.guild.members.resolve(userID).roles.remove(state.cachedGuild.platformsList[platform].roleID);
                }
                delete state.cachedGuild.userDictionary[userID][platform];
            })
            delete state.cachedGuild.platformsList[platform];
            receivedMessage.channel.send(`${platform} information will no longer be recorded.`)
                .catch(console.error);
            savePlatformsList(receivedMessage.guild.id, state.cachedGuild.platformsList);
        } else {
            // Error Message
            receivedMessage.author.send(`${platform} is not currently being recorded in ${receivedMessage.guild}.`)
                .catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please provide a platform to remove.`)
            .catch(console.error);
    }
}

module.exports = removeplatform;
