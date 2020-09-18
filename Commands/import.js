const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { MessageMentions } = require('discord.js');
const { saveObject, directories } = require('./../helpers.js');

var command = new Command("import", false, false, false);

command.execute = (receivedMessage, state, metrics) => {
	// Copy information from the given guild to the current guild for any platforms with matching names
	let sourceGuildID;

	for (const argument of state.messageArray) {
		if (!isNaN(parseInt(argument))) {
			sourceGuildID = argument;
			break;
		} else if (argument.match(MessageMentions.CHANNELS_PATTERN)) {
			sourceGuildID = receivedMessage.mentions.channels.array()[0].guild.id;
			break;
		}
	}

	if (sourceGuildID) {
		if (sourceGuildID != receivedMessage.guild.id) {
			let sourceGuild = directories[sourceGuildID];
			if (sourceGuild) {
				let sourceDictionary = sourceGuild.userDictionary[receivedMessage.author.id];
				if (sourceDictionary) {
					let feedbackText = getString(locale, command.module, "successHeader");
					Object.keys(sourceDictionary).forEach(platform => {
						if (Object.keys(state.platformsList).includes(platform) && !state.userDictionary[receivedMessage.author.id][platform].value && sourceDictionary[platform] && sourceDictionary[platform].value) {
							state.userDictionary[receivedMessage.author.id][platform].value = sourceDictionary[platform].value;
							feedbackText += `\n${platform}: ${sourceDictionary[platform].value}`
						}
					})
					receivedMessage.member.addPlatformRoles(state);

					saveObject(receivedMessage.guild.id, state.userDictionary, 'userDictionary.txt');
					receivedMessage.author.send(feedbackText)
						.catch(console.error);
				} else {
					// Error Message
					receivedMessage.author.send(getString(locale, command.module, "errorNoSourceData"))
						.catch(console.error);
				}
			} else {
				// Error Message
				receivedMessage.author.send(getString(locale, command.module, "errorNoSourceBot").addVariables({
					"botNickname": receivedMessage.client.user
				})).catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, command.module, "errorSameGuild"))
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, command.module, "errorBadSource"))
			.catch(console.error);
	}
}

module.exports = command;
