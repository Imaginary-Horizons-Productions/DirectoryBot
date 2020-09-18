const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');

var command = new Command("whois", false, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Finds the platform and user associated with a given username
	if (state.messageArray.length > 0) {
		var searchTerm = state.messageArray[0];
		var reply = getString(locale, command.module, "successMessage").addVariables({
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
		receivedMessage.author.send(getString(locale, command.module, "errorNoUsername"))
			.catch(console.error);
	}
}

module.exports = command;
