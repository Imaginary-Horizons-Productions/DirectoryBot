const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { saveObject } = require('./../helpers.js');

var command = new Command("removeplatform", true, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Removes the given platform
	if (state.messageArray.length > 0) {
		let platform = state.messageArray[0].toLowerCase();

		if (state.platformsList[platform]) {
			Object.keys(state.userDictionary).forEach(userID => {
				if (state.platformsList[platform].roleID) {
					receivedMessage.guild.members.resolve(userID).roles.remove(state.platformsList[platform].roleID);
				}
				delete state.userDictionary[userID][platform];
			})
			delete state.platformsList[platform];
			receivedMessage.channel.send(getString(locale, command.module, "successMessage").addVariables({
				"platform": platform
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
		receivedMessage.author.send(getString(locale, command.module, "errorNoPlatform"))
			.catch(console.error);
	}
}

module.exports = command;
