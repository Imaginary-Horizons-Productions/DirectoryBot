const Command = require('./../Classes/Command.js');
const { creditsBuilder } = require('./../helpers.js');

var credits = new Command();
credits.names = ["credits", "creditz", "about"];
credits.summary = `Version info and contributors (using help on this command uses the command)`;
credits.managerCommand = false;

credits.help = (clientUser, state) => {
    return creditsBuilder(clientUser.avatarURL());
}

credits.execute = (receivedMessage, state, metrics) => {
    // Displays the credits
    receivedMessage.author.send(creditsBuilder(receivedMessage.client.user.avatarURL()))
        .catch(console.error);
}

module.exports = credits;
