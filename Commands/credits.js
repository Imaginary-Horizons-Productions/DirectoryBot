const Command = require('./../Classes/Command.js');
const { creditsBuilder } = require('./../helpers.js');

var command = new Command();
command.names = ["credits", "creditz", "about"];
command.summary = `Version info and contributors (using help on this command uses the command)`;
command.managerCommand = false;

command.help = (clientUser, state) => {
    return creditsBuilder(clientUser.avatarURL());
}

command.execute = (receivedMessage, state, metrics) => {
    // Displays the credits
    receivedMessage.author.send(creditsBuilder(receivedMessage.client.user.avatarURL())).catch(console.error);
}

module.exports = command;
