const Command = require('./../Classes/Command.js');

var command = new Command(["whois"], `Ask DirectoryBot who a certain username belongs to`, false, false, false)
	.addDescription(`This command checks if anyone uses the given username and private messages you the result.`)
	.addSection(`Look up a username`, `\`@DirectoryBot whois (username)\``);

command.execute = (receivedMessage, state, metrics) => {
	// Finds the platform and user associated with a given username
	if (state.messageArray.length > 0) {
		var searchTerm = state.messageArray[0];
		var reply = `The following people have recorded ${searchTerm} in ${receivedMessage.guild.name}:`;
		Object.keys(state.userDictionary).forEach(userID => {
			for (var platform in state.userDictionary[userID]) {
				if (state.userDictionary[userID][platform].value == searchTerm) {
					reply += `\n**${receivedMessage.guild.members.resolve(userID).displayName}** for *${platform}*`;
				}
			}
		})

		receivedMessage.author.send(reply)
			.catch(console.error);
	} else {
		// Error Message
		receivedMessage.author.send(`Please specify a username to check for.`)
			.catch(console.error);
	}
}

module.exports = command;
