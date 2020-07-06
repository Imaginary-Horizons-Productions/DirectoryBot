const Command = require('./../Classes/Command.js');
const { saveWelcomeMessage } = require('./../helpers.js');

var command = new Command();
command.names = ['welcomemessage'];
command.summary = `Sets a message to send to new members of the server`;
command.managerCommand = true;

command.help = (clientUser, state) => {
	return `The *${state.messageArray[0]}* command sets a message to send to new members of the server.
Syntax: ${clientUser} \`${state.messageArray[0]} (welcome message)\``;
}

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
