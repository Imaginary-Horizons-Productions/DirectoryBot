const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { saveObject } = require('./../helpers.js');

var command = new Command("permissionsrole", true, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Stores are clears the permissions role ID for accidental role mention recovery
	let roleMentions = receivedMessage.mentions.roles.array();
	if (roleMentions.length > 0) {
		state.permissionsRoleID = roleMentions[0].id;
		receivedMessage.channel.send(getString(locale, command.module, "successMesage").addVariables({
			"role": roleMentions[0]
		})).catch(console.error);
		saveObject(receivedMessage.guild.id, state.permissionsRoleID, 'permissionsRole.txt');
	} else {
		state.permissionsRoleID = null;
		receivedMessage.channel.send(getString(locale, command.module, "clearMessage"))
			.catch(console.error);
		saveObject(receivedMessage.guild.id, state.permissionsRoleID, 'permissionsRole.txt');
	}
}

module.exports = command;
