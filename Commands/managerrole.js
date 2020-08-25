const Command = require('./../Classes/Command.js');
const { saveManagerRole } = require('./../helpers.js');

var command = new Command(["managerrole", "setmanagerrole"], `Sets the bot manager role which allows the use of manager commands`, true, false, false)
	.addDescription(`This command sets the manager role, which allows users to use manager-only commands without server administrator privilege. If no role is given, the set role will be cleared.`)
	.addSection(`Set a role`, `\`@DirectoryBot setmanagerrole (role)\``)
	.addSection(`Clear manager role`, `\`@DirectoryBot setmanagerrole\``);

command.execute = (receivedMessage, state, metrics) => {
	// Stores or clears the manager role id
	let roleMentions = receivedMessage.mentions.roles.array();
	if (roleMentions.length > 0) {
		state.managerRoleID = roleMentions[0].id;
		receivedMessage.channel.send(`The ${receivedMessage.client.user} manager role has been set to @${roleMentions[0].name}.`)
			.catch(console.error);
		saveManagerRole(receivedMessage.guild.id, state.managerRoleID);
	} else {
		state.managerRoleID = null;
		receivedMessage.channel.send(`The ${receivedMessage.client.user} manager role has been cleared.`)
			.catch(console.error);
		saveManagerRole(receivedMessage.guild.id, state.managerRoleID);
	}
}

module.exports = command;
