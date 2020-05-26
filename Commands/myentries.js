const Command = require('./../Classes/Command.js');

var command = new Command();
command.names = ['myentries', 'mydata'];
command.summary = `Lists all your platform entries`;
command.managerCommand = false;

command.help = (clientUser, state) => { // function for constructing examples with used overloads
	return `The **${state.messageArray[0]}** command private messages you with the information you've input into DirectoryBot.\n\
Syntax: ${clientUser} \`${state.messageArray[0]}\``;
}

command.execute = (receivedMessage, state, metrics) => {
	// Sends the user all the information they've input into the bot
	let text = `Your entries in ${receivedMessage.guild} are:`;
	let dictionary = state.cachedGuild.userDictionary[receivedMessage.author.id];
	Object.keys(dictionary).forEach(platform => {
		if (dictionary[platform].value) {
			text += '\n' + platform + ': ' + dictionary[platform].value;
        }
	})

	if (text.length < 2001) {
		receivedMessage.author.send(text).catch(console.error);
    } else {
		// Error Message
		receivedMessage.author.send(`Your \`myentries\` message is too long to fit in a single Discord message. Please try the \`lookup\` command instead.`).catch(console.error);
    }
}

module.exports = command;
