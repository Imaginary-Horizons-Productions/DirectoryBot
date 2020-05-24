const Command = require('./../Classes/Command.js');
const { savePermissionsRole } = require('./../helpers.js');

var command = new Command();
command.names = ['permissionsrole'];
command.summary = `Sets the bot permissions role; not mentioning a role clears the setting`;
command.managerCommand = true;

command.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command updates the permissions role. This allows ${clientUser} to interpret accidental mentions of that role as command messages.\n\
Syntax: ${clientUser} \`${state.messageArray[0]} (role)\``;
}

command.execute = (receivedMessage, state, metrics) => {
	// Stores are clears the permissions role ID for accidental role mention recovery
    let roleMentions = receivedMessage.mentions.roles.array();
    if (roleMentions.length > 0) {
        state.cachedGuild.permissionsRoleID = roleMentions[0].id;
        receivedMessage.channel.send(`The ${receivedMessage.client.user} permissions role has been stored as @${roleMentions[0].name}.`).catch(console.error);
        savePermissionsRole(receivedMessage.guild.id, state.cachedGuild.permissionsRoleID);
    } else {
        state.cachedGuild.permissionsRoleID = null;
        receivedMessage.channel.send(`The ${receivedMessage.client.user} permissions role has been cleared.`).catch(console.error);
        savePermissionsRole(receivedMessage.guild.id, state.cachedGuild.permissionsRoleID);
    }
}

module.exports = command;
