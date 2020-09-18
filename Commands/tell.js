const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { MessageMentions } = require('discord.js');
const { millisecondsToHours } = require('./../helpers.js');

var command = new Command("tell", false, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Sends the user's given information to another user, which later expires
	let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);

	if (mentionedGuildMembers.length >= 1) {
		let nonMentions = state.messageArray.filter(word => !word.match(MessageMentions.USERS_PATTERN));
		if (nonMentions.length > 0) {
			var platform = nonMentions[0].toLowerCase();
			if (Object.keys(state.platformsList).includes(platform)) {
				if (state.userDictionary[receivedMessage.author.id] && state.userDictionary[receivedMessage.author.id][platform].value) {
					let sender = receivedMessage.author;
					var senderInfo = getString(locale, command.module, "successMessageRecipient").addVariables({
						"sender": sender,
						"server": receivedMessage.guild.name,
						"possessivepronoun": state.userDictionary[receivedMessage.author.id].possessivepronoun && state.userDictionary[receivedMessage.author.id]["possessivepronoun"].value ? state.userDictionary[receivedMessage.author.id].possessivepronoun.value : 'their',
						"platform": platform,
						"term": state.platformsList[platform].term
					});

					mentionedGuildMembers.forEach(recipient => {
						if (!recipient.bot) {
							recipient.send(senderInfo + getString(locale, command.module, "dataMessage").addVariables({ "value": state.userDictionary[receivedMessage.author.id][platform].value }) + expirationWarning[locale].addVariables({ "time": millisecondsToHours(locale, state.infoLifetime) })).then(sentMessage => {
								sentMessage.setToExpire(state, receivedMessage.guild.id, senderInfo + getString(locale, command.module, "expiredMessage").addVariables({
									"botNickname": receivedMessage.client.user,
									"sender": sender,
									"platform": platform
								}));
							}).catch(console.error);
						}
					})
					receivedMessage.author.send(getString(locale, command.module, "successMessageSender").addVariables({
						"platform": platform,
						"term": state.platformsList[platform].term,
						"mentionedGuildMembers": mentionedGuildMembers.toString()
					})).catch(console.error);
				} else {
					// Error Message
					receivedMessage.author.send(getString(locale, command.module, "errorNoData").addVariables({
						"platform": platform,
						"term": state.platformsList[platform].term,
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
