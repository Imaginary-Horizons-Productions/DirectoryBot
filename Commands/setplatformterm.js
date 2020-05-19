const Command = require('./../Classes/Command.js');
const { savePlatformsList } = require('./../helpers.js');

var command = new Command();
command.names = ["changeplatformterm", "setplatformterm"];
command.summary = `Changes what DirectoryBot calls information for the given platform`;
command.managerCommand = true;

command.help = (clientUser, state) => { // function for constructing examples with used overloads
    return `The *${state.messageArray[0]}* changes what ${clientUser} calls information from the given platform (default is "username").\n\
Syntax: ${clientUser} \`${state.messageArray[0]} (platform name) (new term)\``;
}

command.execute = (receivedMessage, state, metrics) => {
    // Changes the term used to refer to information for a given platform
    if (state.messageArray.length > 0) {
        if (state.messageArray.length > 1) {
            let platform = state.messageArray[0].toLowerCase();
            let term = state.messageArray[1];

            if (state.cachedGuild.platformsList[platform]) {
                state.cachedGuild.platformsList[platform.toLowerCase()].term = term;
                receivedMessage.author.send(`Information for *${platform}* will now be referred to as **${term}** in ${receivedMessage.guild}.`);
                savePlatformsList(receivedMessage.guild.id, state.cachedGuild.platformsList);
            } else {
                // Error Message
                receivedMessage.author.send(`${platform} is not currently being recorded in ${receivedMessage.guild}.`);
            }
        } else {
            // Error Message
            receivedMessage.author.send(`Please provide a term to change to for the platform.`);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please provide a platform for which to change the term.`);
    }
}

module.exports = command;
