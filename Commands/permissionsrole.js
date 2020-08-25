const Command = require('./../Classes/Command.js');
const { saveObject } = require('./../helpers.js');

var command = new Command(['permissionsrole', 'setpermissionsrole'], `Sets the bot permissions role; not mentioning a role clears the setting`, true, false, false)
	.addDescription(`This command updates the permissions role. This allows DirectoryBot to interpret accidental mentions of that role as command messages.`)
	.addSection(`Set the permissions role`, `\`@DirectoryBot permissionsrole (role)\``)
	.addSection(`Clear the permissions role`, `\`@DirectoryBot permissionsrole\``);

command.execute = (receivedMessage, state, metrics) => {
	// Stores are clears the permissions role ID for accidental role mention recovery
	let roleMentions = receivedMessage.mentions.roles.array();
	if (roleMentions.length > 0) {
		state.permissionsRoleID = roleMentions[0].id;
		receivedMessage.channel.send(`The ${receivedMessage.client.user} permissions role has been stored as ${roleMentions[0]}.`)
			.catch(console.error);
		saveObject(receivedMessage.guild.id, state.permissionsRoleID, 'permissionsRole.txt');
	} else {
		state.permissionsRoleID = null;
		receivedMessage.channel.send(`The ${receivedMessage.client.user} permissions role has been cleared.`)
			.catch(console.error);
		saveObject(receivedMessage.guild.id, state.permissionsRoleID, 'permissionsRole.txt');
	}
}

module.exports = command;
