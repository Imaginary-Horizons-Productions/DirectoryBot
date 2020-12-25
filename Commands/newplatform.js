const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { MessageMentions } = require('discord.js');
const Platform = require('./../Classes/Platform.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { directories, saveObject } = require('./../helpers.js');

var command = new Command("newplatform", true, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Adds a new platform to track
	if (state.messageArray.length > 0) {
		let messageArray = state.messageArray;
		let platform = messageArray.shift().toLowerCase();
		let term = messageArray.shift();
		let role = receivedMessage.mentions.roles.array()[0];
		let description = messageArray.join(' ');

		if (!platform.match(MessageMentions.USERS_PATTERN)) {
			if (!directories[receivedMessage.guild.id].platformsList[platform]) {
				directories[receivedMessage.guild.id].platformsList[platform] = new Platform(term, description);
				if (role) {
					directories[receivedMessage.guild.id].platformsList[platform].roleID = role.id;
					directories[receivedMessage.guild.id].platformsList[platform].roleName = role.name;
				}
				Object.keys(directories[receivedMessage.guild.id].userDictionary).forEach(userID => {
					directories[receivedMessage.guild.id].userDictionary[userID][platform] = new FriendCode();
				})
				receivedMessage.channel.send(getString(locale, command.module, "successMessage").addVariables({
					"platform": platform,
					"term": directories[receivedMessage.guild.id].platformsList[platform].term,
					"role": role ? getString(locale, command.module, "roleAddendum").addVariables({
						"role": role
					}) : ""
				})).catch(console.error);
				saveObject(receivedMessage.guild.id, directories[receivedMessage.guild.id].platformsList, 'platformsList.txt');
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
