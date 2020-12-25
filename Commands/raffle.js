const Command = require('../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { directories } = require('./../helpers.js');
const { MessageMentions } = require('discord.js');

var command = new Command("raffle", false, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Randomly select a user from a list of platforms, roles, and users
	let identifiers = {
		platforms: [],
		roleIDs: []
	};
	let userIDsPool = [];
	for (const word of state.messageArray) {
		if (word.match(MessageMentions.ROLES_PATTERN)) {
			identifiers.roleIDs.push(word.replace(/\D/g, ""));
		} else if (word.match(MessageMentions.USERS_PATTERN)) {
			userIDsPool.push(word.replace(/\D/g, ""));
		} else {
			identifiers.platforms.push(word);
		}
	}

	if (identifiers.platforms.length + identifiers.roleIDs.length + userIDsPool.length > 0) {
		// Get users with data recorded for mentioned platforms
		for (const platform of identifiers.platforms) {
			let userDictionary = directories[receivedMessage.guild.id].userDictionary;
			Object.keys(userDictionary).forEach(userID => {
				console.log(identifiers.platforms);
				if (userDictionary[userID] && userDictionary[userID][platform]) {
					if (userDictionary[userID][platform].value) {
						if (!userIDsPool.includes(userID)) {
							userIDsPool.push(userID);
						}
					}
				}
			});
		}

		// Get users with mentioned roles
		for (const roleID of identifiers.roleIDs) {
			receivedMessage.guild.roles.resolve(roleID).members.keyArray().forEach(userID => {
				if (!userIDsPool.includes(userID)) {
					userIDsPool.push(userID);
				}
			})
		}

		// Select winner
		if (userIDsPool.length > 0) {
			receivedMessage.channel.send(getString(locale, command.module, "successMessage").addVariables({
				"winner": receivedMessage.guild.members.resolve(userIDsPool[Math.floor(Math.random() * userIDsPool.length)]).displayName
			}))
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, command.module, "errorNoUsers"))
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, command.module, "errorNoMentions"))
			.catch(console.error);
	}
}

module.exports = command;
