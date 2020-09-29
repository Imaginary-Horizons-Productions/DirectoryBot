const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { saveObject } = require('./../helpers.js');

var command = new Command("managerrole", true, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Stores or clears the manager role id
	let roleMentions = receivedMessage.mentions.roles.array();
	if (roleMentions.length > 0) {
		state.managerRoleID = roleMentions[0].id;
		receivedMessage.channel.send(getString(locale, command.module, "successMessage").addVariables({
			"botNickname": receivedMessage.client.user,
			"role": roleMentions[0]
		})).catch(console.error);
		saveObject(receivedMessage.guild.id, state.managerRoleID, 'managerRole.txt');
	} else {
		state.managerRoleID = null;
		receivedMessage.channel.send(getString(locale, command.module, "clearMessage").addVariables({
			"botNickname": receivedMessage.client.user
		})).catch(console.error);
		saveObject(receivedMessage.guild.id, state.managerRoleID, 'managerRole.txt');
	}
}

module.exports = command;
