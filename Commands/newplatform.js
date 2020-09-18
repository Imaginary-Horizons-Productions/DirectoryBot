const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { MessageMentions } = require('discord.js');
const Platform = require('./../Classes/Platform.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { saveObject } = require('./../helpers.js');

var command = new Command("newplatform", true, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Adds a new platform to track
	if (state.messageArray.length > 0) {
		let messageArray = state.messageArray;
		let platform = messageArray.shift().toLowerCase();
		let term = messageArray.shift();
		let description = messageArray.join(' ');

		if (!platform.match(MessageMentions.USERS_PATTERN)) {
			if (!state.platformsList[platform]) {
				state.platformsList[platform] = new Platform(term, description);
				Object.keys(state.userDictionary).forEach(userID => {
					state.userDictionary[userID][platform] = new FriendCode();
				})
				receivedMessage.channel.send(getString(locale, command.module, "successMessage").addVariables({
					"platform": platform,
					"term": state.platformsList[platform].term
				})).catch(console.error);
				saveObject(receivedMessage.guild.id, state.platformsList, 'platformsList.txt');
			} else {
				// Error Message
				receivedMessage.author.send(getString(locale, command.module, "errorDupePlatform").addVariables({
					"server": receivedMessage.guild.name,
					"platform": platform
				})).catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, command.module, "errorNoUserNamedPlatforms"))
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, command.module, "errorNoName"))
			.catch(console.error);
	}
}

module.exports = command;
