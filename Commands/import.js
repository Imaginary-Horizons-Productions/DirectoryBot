const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { MessageMentions } = require('discord.js');
const { saveObject, directories } = require('./../helpers.js');

var command = new Command("import", false, false, false);

command.execute = (receivedMessage, state, locale) => {
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
						if (Object.keys(directories[receivedMessage.guild.id].platformsList).includes(platform) && !directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id][platform].value && sourceDictionary[platform] && sourceDictionary[platform].value) {
							directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id][platform].value = sourceDictionary[platform].value;
							feedbackText += `\n${platform}: ${sourceDictionary[platform].value}`
						}
					})
					receivedMessage.member.addPlatformRoles(directories[receivedMessage.guild.id]);

					saveObject(receivedMessage.guild.id, directories[receivedMessage.guild.id].userDictionary, 'userDictionary.txt');
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
