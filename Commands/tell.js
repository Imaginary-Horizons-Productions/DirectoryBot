const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { expirationWarning } = require('./../localization.js');
const { MessageMentions } = require('discord.js');
const { millisecondsToHours } = require('./../helpers.js');

var command = new Command(false, false, false);
command.names = {
	"en_US": ["tell", "send"]
}

command.summary = {
	"en_US": "Have DirectoryBot send someone your information"
}

command.description = {
	"en_US": "This command sends your information on the given platform to the given user."
}

command.sections = {
	"en_US": [
		new Section("Tell someone your data", "`@DirectoryBot tell (platform) (user)`")
	]
}

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
					var senderInfo = successMessageRecipient[locale].addVariables({
						"sender": sender,
						"server": receivedMessage.guild.name,
						"possessivepronoun": state.userDictionary[receivedMessage.author.id].possessivepronoun && state.userDictionary[receivedMessage.author.id]["possessivepronoun"].value ? state.userDictionary[receivedMessage.author.id].possessivepronoun.value : 'their',
						"platform": platform,
						"term": state.platformsList[platform].term
					});

					mentionedGuildMembers.forEach(recipient => {
						if (!recipient.bot) {
							recipient.send(senderInfo + dataMessage[locale].addVariables({ "value": state.userDictionary[receivedMessage.author.id][platform].value }) + expirationWarning[locale].addVariables({ "time": millisecondsToHours(locale, state.infoLifetime) })).then(sentMessage => {
								sentMessage.setToExpire(state, receivedMessage.guild.id, senderInfo + expiredMessage[locale].addVariables({
									"botNickname": receivedMessage.client.user,
									"sender": sender,
									"platform": platform
								}));
							}).catch(console.error);
						}
					})
					receivedMessage.author.send(successMessageSender[locale].addVariables({
						"platform": platform,
						"term": state.platformsList[platform].term,
						"mentionedGuildMembers": mentionedGuildMembers.toString()
					})).catch(console.error);
				} else {
					// Error Message
					receivedMessage.author.send(errorNoData[locale].addVariables({
						"platform": platform,
						"term": state.platformsList[platform].term,
						"server": receivedMessage.guild.name
					})).catch(console.error);
				}
			} else {
				// Error Message
				receivedMessage.author.send(errorBadPlatform[locale].addVariables({
					"platform": platform,
					"server": receivedMessage.guild.name
				})).catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(errorNoPlatform[locale])
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(errorNoRecipient[locale].addVariables({
			"server": receivedMessage.guild.name
		})).catch(console.error);
	}
}

let successMessageRecipient = {
	"en_US": "${sender} from ${server} has sent you ${possessivepronoun} ${platform} ${term}"
}

let dataMessage = {
	"en_US": ". It is:\n\t${value}\n\n"
}

let expiredMessage = {
	"en_US": ", but it has expired. You can look it up again with ${botNickname}` lookup `${sender}` ${platform}`."
}

let successMessageSender = {
	"en_US": "Your ${platform} ${term} has been sent to ${mentionedGuildMembers}."
}

let errorNoData = {
	"en_US": "You have not recorded a ${platform} ${term} in ${server}."
}

let errorBadPlatform = {
	"en_US": "${platform} is not currently being tracked in ${server}."
}

let errorNoPlatform = {
	"en_US": "Please provide the platform of the information to send."
}

let errorNoRecipient = {
	"en_US": "Please mention someone in ${server} to send your information to."
}

module.exports = command;
