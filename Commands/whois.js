const Command = require('./../Classes/Command.js');
const { directories, getString } = require('./../Localizations/localization.js');

var command = new Command("whois", false, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Finds the platform and user associated with a given username
	if (state.messageArray.length > 0) {
		var searchTerm = state.messageArray[0];
		var reply = getString(locale, command.module, "successMessage").addVariables({
			"searchTerm": searchTerm,
			"server": receivedMessage.guild.name
		});
		Object.keys(directories[receivedMessage.guild.id].userDictionary).forEach(userID => {
			for (var platform in directories[receivedMessage.guild.id].userDictionary[userID]) {
				if (directories[receivedMessage.guild.id].userDictionary[userID][platform].value == searchTerm) {
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
