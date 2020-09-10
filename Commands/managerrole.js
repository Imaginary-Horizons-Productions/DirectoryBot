const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { saveObject } = require('./../helpers.js');

var command = new Command(true, false, false);
command.names = {
	"en_US": ["managerrole", "setmanagerrole"]
}

command.summary = {
	"en_US": "Sets the bot manager role which allows the use of manager commands"
}

command.description = {
	"en_US": "This command sets the manager role, which allows users to use manager-only commands without server administrator privilege. If no role is given, the set role will be cleared."
}

command.sections = {
	"en_US": [
		new Section("Set a role", "`@DirectoryBot setmanagerrole (role)`"),
		new Section("Clear manager role", "`@DirectoryBot setmanagerrole`")
	]
}

command.execute = (receivedMessage, state, locale) => {
	// Stores or clears the manager role id
	let roleMentions = receivedMessage.mentions.roles.array();
	if (roleMentions.length > 0) {
		state.managerRoleID = roleMentions[0].id;
		receivedMessage.channel.send(successMessage[locale].addVariables({
			"botNickname": receivedMessage.client.user,
			"role": roleMentions[0]
		})).catch(console.error);
		saveObject(receivedMessage.guild.id, state.managerRoleID, 'managerRole.txt');
	} else {
		state.managerRoleID = null;
		receivedMessage.channel.send(clearMessage[locale].addVariables({
			"bothNickname": receivedMessage.client.user
		})).catch(console.error);
		saveObject(receivedMessage.guild.id, state.managerRoleID, 'managerRole.txt');
	}
}

let successMessage = {
	"en_US": "The ${botNickname} manager role has been set to ${role}."
}

let clearMessage = {
	"en_US": "The ${botNickname} manager role has been cleared."
}

module.exports = command;
