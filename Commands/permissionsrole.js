const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { saveObject } = require('./../helpers.js');

var command = new Command(true, false, false);
command.names = {
	"en_US": ['permissionsrole', 'setpermissionsrole']
}

command.summary = {
	"en_US": `Sets the bot permissions role; not mentioning a role clears the setting`
}

command.description = {
	"en_US": `This command updates the permissions role. This allows DirectoryBot to interpret accidental mentions of that role as command messages.`
}

command.sections = {
	"en_US": [
		new Section(`Set the permissions role`, `\`@DirectoryBot permissionsrole (role)\``),
		new Section(`Clear the permissions role`, `\`@DirectoryBot permissionsrole\``)
	]
}

command.execute = (receivedMessage, state, locale) => {
	// Stores are clears the permissions role ID for accidental role mention recovery
	let roleMentions = receivedMessage.mentions.roles.array();
	if (roleMentions.length > 0) {
		state.permissionsRoleID = roleMentions[0].id;
		receivedMessage.channel.send(successMesage[locale].addVariables({
			"role": roleMentions[0]
		})).catch(console.error);
		saveObject(receivedMessage.guild.id, state.permissionsRoleID, 'permissionsRole.txt');
	} else {
		state.permissionsRoleID = null;
		receivedMessage.channel.send(clearMessage[locale])
			.catch(console.error);
		saveObject(receivedMessage.guild.id, state.permissionsRoleID, 'permissionsRole.txt');
	}
}

let successMesage = {
	"en_US": "The permissions role has been stored as ${role}."
}

let clearMessage = {
	"en_US": "The permissions role has been cleared."
}

module.exports = command;
