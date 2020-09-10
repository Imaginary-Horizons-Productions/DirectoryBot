const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');

var command = new Command(false, false, false);
command.names = {
	"en_US": ["whois"]
}

command.summary = {
	"en_US": "Ask DirectoryBot who a certain username belongs to"
}

command.description = {
	"en_US": `This command checks if anyone uses the given username and private messages you the result.`
}

command.sections = {
	"en_US": [
		new Section(`Look up a username`, `\`@DirectoryBot whois (username)\``)
	]
}

command.execute = (receivedMessage, state, locale) => {
	// Finds the platform and user associated with a given username
	if (state.messageArray.length > 0) {
		var searchTerm = state.messageArray[0];
		var reply = successMessage[locale].addVariables({
			"searchTerm": searchTerm,
			"server": recievedMessage.guild.name
		});
		Object.keys(state.userDictionary).forEach(userID => {
			for (var platform in state.userDictionary[userID]) {
				if (state.userDictionary[userID][platform].value == searchTerm) {
					reply += `\n**${receivedMessage.guild.members.resolve(userID).displayName}**: *${platform}*`;
				}
			}
		})

		receivedMessage.author.send(reply)
			.catch(console.error);
	} else {
		// Error Message
		receivedMessage.author.send(errorNoUsername[locale])
			.catch(console.error);
	}
}

let successMessage = {
	"en_US": "The following people have recorded ${searchTerm} in ${server}:"
}

let errorNoUsername = {
	"en_US": "Please specify a username to check for."
}

module.exports = command;
