const Command = require('./../Classes/Command.js');
const { saveManagerRole } = require('./../helpers.js');

var command = new Command();
command.names = ["managerrole", "setoprole"];
command.summary = `Sets the bot manager role; not mentioning a role clears the setting`;
command.managerCommand = true;

command.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command updates the operator role for ${clientUser}. Users with this role use operator features of this bot without serverwide administrator privileges.\n\
Syntax: ${clientUser} \`${state.messageArray[0]} (role)\``;
}

command.execute = (receivedMessage, state, metrics) => {
    // Stores or clears the manager role id
    let roleMentions = receivedMessage.mentions.roles.array();
    if (roleMentions.length > 0) {
        state.cachedGuild.managerRoleID = roleMentions[0].id;
        receivedMessage.channel.send(`The ${receivedMessage.client.user} manager role has been set to @${roleMentions[0].name}.`).catch(console.error);
        saveManagerRole(receivedMessage.guild.id, state.cachedGuild.managerRoleID);
    } else {
        state.cachedGuild.managerRoleID = null;
        receivedMessage.channel.send(`The ${receivedMessage.client.user} manager role has been cleared.`).catch(console.error);
        saveManagerRole(receivedMessage.guild.id, state.cachedGuild.managerRoleID);
    }
}

module.exports = command;
