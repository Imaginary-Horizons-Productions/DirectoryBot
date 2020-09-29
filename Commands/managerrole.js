const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { directories, saveObject } = require('./../helpers.js');

var command = new Command("managerrole", true, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Stores or clears the manager role id
	let roleMentions = receivedMessage.mentions.roles.array();
	if (roleMentions.length > 0) {
		directories[receivedMessage.guild.id].managerRoleID = roleMentions[0].id;
		receivedMessage.channel.send(getString(locale, command.module, "successMessage").addVariables({
			"botNickname": receivedMessage.client.user,
			"role": roleMentions[0]
		})).catch(console.error);
		saveObject(receivedMessage.guild.id, directories[receivedMessage.guild.id].managerRoleID, 'managerRole.txt');
	} else {
		directories[receivedMessage.guild.id].managerRoleID = null;
		console.log(directories[receivedMessage.guild.id].managerRoleID);
		receivedMessage.channel.send(getString(locale, command.module, "clearMessage").addVariables({
			"botNickname": receivedMessage.client.user
		})).catch(console.error);
		saveObject(receivedMessage.guild.id, directories[receivedMessage.guild.id].managerRoleID, 'managerRole.txt');
	}
}

module.exports = command;
