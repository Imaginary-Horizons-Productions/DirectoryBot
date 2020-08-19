const Command = require('./../Classes/Command.js');
const { saveWelcomeMessage } = require('./../helpers.js');

var command = new Command(['welcomemessage'], `Sets a message to send to new members of the server`, true, false, false)
	.addDescription(`This command sets a message to send to new members of the server.`)
	.addSection(`Set a message to send to new server members`, `\`@DirectoryBot welcomemessage (message)\``);

command.execute = (receivedMessage, state, metrics) => {
	// Sets a message to send to new members of the guild
	if (state.messageArray.length > 0) {
		let welcome = state.messageArray.join(" ");
		state.cachedGuild.welcomeMessage = welcome;
		receivedMessage.channel.send(`The welcome message has been set to:\n\t${welcome}`)
			.catch(console.error);
	} else {
		state.cachedGuild.welcomeMessage = "";
		receivedMessage.channel.send(`The welcome message has been cleared.`)
			.catch(console.error);
	}
	saveWelcomeMessage(receivedMessage.guild.id, state.cachedGuild.welcomeMessage);
}

module.exports = command;
