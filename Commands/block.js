const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { saveBlockDictionary } = require('./../helpers.js');

var command = new Command("block", false, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Adds the mentioned user to a list that prevents them from checking the author's data
	let mentionedGuildMember = receivedMessage.mentions.users.array().filter(id => id != receivedMessage.client.user.id);

	if (mentionedGuildMember.length > 0) {
		if (!state.blockDictionary[receivedMessage.author.id]) {
			state.blockDictionary[receivedMessage.author.id] = [];
		}

		if (!state.blockDictionary[receivedMessage.author.id].includes(mentionedGuildMember[0].id)) {
			state.blockDictionary[receivedMessage.author.id].push(mentionedGuildMember[0].id);
			receivedMessage.author.send(getString(locale, command.module, "blockMessage").addVariables({
				"blockedPerson": mentionedGuildMember[0],
				"server": receivedMessage.guild
			})).catch(console.error);
		} else {
			state.blockDictionary[receivedMessage.author.id].splice(state.blockDictionary[receivedMessage.author.id].indexOf(mentionedGuildMember[0].id), 1);
			receivedMessage.author.send(getString(locale, command.module, "unblockMessage").addVariables({
				"unblockedPerson": mentionedGuildMember[0],
				"server": receivedMessage.guild
			})).catch(console.error);
		}
		saveBlockDictionary(receivedMessage.guild.id, state.blockDictionary);
	} else {
		// Error Message
		receivedMessage.author.send(errorNoMention[locale])
			.catch(console.error);
	}
}

module.exports = command;
