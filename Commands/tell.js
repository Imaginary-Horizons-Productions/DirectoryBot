const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { MessageMentions } = require('discord.js');
const { directories, millisecondsToHours } = require('./../helpers.js');

var command = new Command("tell", false, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Sends the user's given information to another user, which later expires
	let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);

	if (mentionedGuildMembers.length >= 1) {
		let nonMentions = state.messageArray.filter(word => !word.match(MessageMentions.USERS_PATTERN));
		if (nonMentions.length > 0) {
			var platform = nonMentions[0].toLowerCase();
			if (Object.keys(directories[receivedMessage.guild.id].platformsList).includes(platform)) {
				if (directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id]&& directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id][platform] && directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id][platform].value) {
					let sender = receivedMessage.author;
					var senderInfo = getString(locale, command.module, "successMessageRecipient").addVariables({
						"sender": sender,
						"server": receivedMessage.guild.name,
						"possessivepronoun": directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id].possessivepronoun && directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id]["possessivepronoun"].value ? directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id].possessivepronoun.value : 'their',
						"platform": platform,
						"term": directories[receivedMessage.guild.id].platformsList[platform].term
					});

					mentionedGuildMembers.forEach(recipient => {
						if (!recipient.bot) {
							recipient.send(senderInfo + getString(locale, command.module, "dataMessage").addVariables({ "value": directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id][platform].value }) + getString(locale, "DirectoryBot", "expirationWarning").addVariables({ "time": millisecondsToHours(locale, directories[receivedMessage.guild.id].infoLifetime) })).then(sentMessage => {
								sentMessage.setToExpire(directories[receivedMessage.guild.id], receivedMessage.guild.id, senderInfo + getString(locale, command.module, "expiredMessage").addVariables({
									"botNickname": receivedMessage.client.user,
									"sender": sender,
									"platform": platform
								}));
							}).catch(console.error);
						}
					})
					receivedMessage.author.send(getString(locale, command.module, "successMessageSender").addVariables({
						"platform": platform,
						"term": directories[receivedMessage.guild.id].platformsList[platform].term,
						"mentionedGuildMembers": mentionedGuildMembers.toString()
					})).catch(console.error);
				} else {
					// Error Message
					receivedMessage.author.send(getString(locale, command.module, "errorNoData").addVariables({
						"platform": platform,
						"term": directories[receivedMessage.guild.id].platformsList[platform].term,
						"server": receivedMessage.guild.name
					})).catch(console.error);
				}
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
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, command.module, "errorNoRecipient").addVariables({
			"server": receivedMessage.guild.name
		})).catch(console.error);
	}
}

module.exports = command;
