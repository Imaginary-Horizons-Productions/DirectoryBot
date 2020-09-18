const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { saveObject } = require('./../helpers.js');

var command = new Command("setplatformterm", true, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Changes the term used to refer to information for a given platform
	if (state.messageArray.length > 0) {
		if (state.messageArray.length > 1) {
			let platform = state.messageArray[0].toLowerCase();
			let term = state.messageArray[1];

			if (state.platformsList[platform]) {
				state.platformsList[platform].term = term;
				receivedMessage.author.send(getString(locale, command.module, "successMessage").addVariables({
					"platform": platform,
					"term": term,
					"server": receivedMessage.guild.name
				})).catch(console.error);
				saveObject(receivedMessage.guild.id, state.platformsList, 'platformsList.txt');
			} else {
				// Error Message
				receivedMessage.author.send(getString(locale, command.module, "errorBadPlatform").addVariables({
					"platform": platform,
					"server": receivedMessage.guild.name
				})).catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, command.module, "errorNoTerm"))
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, command.module, "errorNoPlatform"))
			.catch(console.error);
	}
}

module.exports = command;
