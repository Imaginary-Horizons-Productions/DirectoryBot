const Command = require('./../Classes/Command.js');
const { savePermissionsRole } = require('./../helpers.js');

var command = new Command(['permissionsrole', 'setpermissionsrole'], `Sets the bot permissions role; not mentioning a role clears the setting`, true, false, false)
	.addDescription(`This command updates the permissions role. This allows DirectoryBot to interpret accidental mentions of that role as command messages.`)
	.addSection(`Set the permissions role`, `\`@DirectoryBot permissionsrole (role)\``);

command.execute = (receivedMessage, state, metrics) => {
	// Stores are clears the permissions role ID for accidental role mention recovery
	let roleMentions = receivedMessage.mentions.roles.array();
	if (roleMentions.length > 0) {
		state.cachedGuild.permissionsRoleID = roleMentions[0].id;
		receivedMessage.channel.send(`The ${receivedMessage.client.user} permissions role has been stored as @${roleMentions[0].name}.`)
			.catch(console.error);
		savePermissionsRole(receivedMessage.guild.id, state.cachedGuild.permissionsRoleID);
	} else {
		state.cachedGuild.permissionsRoleID = null;
		receivedMessage.channel.send(`The ${receivedMessage.client.user} permissions role has been cleared.`)
			.catch(console.error);
		savePermissionsRole(receivedMessage.guild.id, state.cachedGuild.permissionsRoleID);
	}
}

module.exports = command;
