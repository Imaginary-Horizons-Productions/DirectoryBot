const Command = require('./../Classes/Command.js');
const { savePlatformsList } = require('./../helpers.js');

var command = new Command();
command.names = ["removeplatform"];
command.summary = `Stop recording and distributing user information for a game/service`;
command.managerCommand = true;

command.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command specifies a platform for ${clientUser} to stop recording and distributing information for. Note: this command does not remove roles associated with platforms in case someone has that role but wasn't given it by ${client.user}.\n\
Syntax: ${clientUser} \`${state.messageArray[0]} (platform to remove)\``;
}

command.execute = (receivedMessage, state, metrics) => {
    // Removes the given platform
    if (state.messageArray.length > 0) {
        let platform = state.messageArray[0].toLowerCase();

        if (state.cachedGuild.platformsList[platform]) {
            delete state.cachedGuild.platformsList[platform];
            Object.keys(state.cachedGuild.userDictionary).forEach(userID => {
                delete state.cachedGuild.userDictionary[userID][platform];
            })
            receivedMessage.channel.send(`${platform} information will no longer be recorded.`);
            savePlatformsList(receivedMessage.guild.id);
        } else {
            // Error Message
            receivedMessage.author.send(`${platform} is not currently being recorded in ${receivedMessage.guild}.`);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please provide a platform to remove.`).cath(console.error);
    }
}

module.exports = command;
