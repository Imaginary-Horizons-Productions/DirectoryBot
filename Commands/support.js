const Command = require('./../Classes/Command.js');
const { supportBuilder } = require('./../helpers.js');

var support = new Command();
support.names = ["support"];
support.summary = `Lists the ways to support development of DirectoryBot`;
support.managerCommand = false;

support.help = (clientUser, state) => {
    return supportBuilder(clientUser.displayAvatarURL());
}

support.execute = (receivedMessage, state, metrics) => {
    // Lists ways users can support development
    receivedMessage.author.send(supportBuilder(receivedMessage.client.user.displayAvatarURL()))
        .catch(console.error);
}

module.exports = support;
