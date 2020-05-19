const Command = require('./../Classes/Command.js');

var command = new Command();
command.names = ["platforms"];
command.summary = `List the games/services DirectoryBot can be used to record or retrieve information for (using help on this command uses the command)`;
command.managerCommand = false;

command.help = (clientUser, state) => { // function for constructing examples with used overloads
    let processedText = Object.keys(state.cachedGuild.platformsList).toString().replace(/,/g, ', ');

    return `This server's tracked platforms are: ${processedText}`;
}

command.execute = (receivedMessage, state, metrics) => {
    // Command specifications go here
    let processedText = Object.keys(state.cachedGuild.platformsList).toString().replace(/,/g, ', ');

    receivedMessage.channel.send(`This server's tracked platforms are: ${processedText}`).catch(console.error);
}

module.exports = command;
