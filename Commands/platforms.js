const Command = require('./../Classes/Command.js');
const { platformsBuilder } = require('./../helpers.js');

var platforms = new Command();
platforms.names = ["platforms"];
platforms.summary = `List the games/services DirectoryBot can be used to record or retrieve information for (using help on this command uses the command)`;
platforms.managerCommand = false;

platforms.help = (clientUser, state) => {
    return platformsBuilder(state.cachedGuild.platformsList);
}

platforms.execute = (receivedMessage, state, metrics) => {
    // List the platforms being tracked in the guild
    receivedMessage.channel.send(platformsBuilder(state.cachedGuild.platformsList))
        .catch(console.error);
}

module.exports = platforms;
