const Command = require('./../Classes/Command.js');
const { savePlatformsList } = require('./../helpers.js');

var setplatformterm = new Command();
setplatformterm.names = ["changeplatformterm", "setplatformterm"];
setplatformterm.summary = `Changes what DirectoryBot calls information for the given platform`;
setplatformterm.managerCommand = true;

setplatformterm.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* changes what ${clientUser} calls information from the given platform (default is "username").
Syntax: ${clientUser} \`${state.messageArray[0]} (platform name) (new term)\``;
}

setplatformterm.execute = (receivedMessage, state, metrics) => {
    // Changes the term used to refer to information for a given platform
    if (state.messageArray.length > 0) {
        if (state.messageArray.length > 1) {
            let platform = state.messageArray[0].toLowerCase();
            let term = state.messageArray[1];

            if (state.cachedGuild.platformsList[platform]) {
                state.cachedGuild.platformsList[platform].term = term;
                receivedMessage.author.send(`Information for *${platform}* will now be referred to as **${term}** in ${receivedMessage.guild}.`)
                    .catch(console.error);
                savePlatformsList(receivedMessage.guild.id, state.cachedGuild.platformsList);
            } else {
                // Error Message
                receivedMessage.author.send(`${platform} is not currently being recorded in ${receivedMessage.guild}.`)
                    .catch(console.error);
            }
        } else {
            // Error Message
            receivedMessage.author.send(`Please provide a term to change to for the platform.`)
                .catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please provide a platform for which to change the term.`)
            .catch(console.error);
    }
}

module.exports = setplatformterm;
