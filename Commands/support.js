const Command = require('./../Classes/Command.js');
const { MessageEmbed } = require('discord.js');
const { supportBuilder } = require('./../helpers.js');

var command = new Command();
command.names = ["support"];
command.summary = `Lists the ways to support development of DirectoryBot`;
command.managerCommand = false;

command.help = (clientUser, state) => {
    return supportBuilder(clientUser.displayAvatarURL());
}

command.execute = (receivedMessage, state, metrics) => {
    // Lists ways users can support development
    receivedMessage.author.send(supportBuilder(receivedMessage.client.user.displayAvatarURL()));
}

module.exports = command;
