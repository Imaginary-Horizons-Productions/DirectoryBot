const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { directories } = require('../helpers.js');

var command = new Command("multistream", false, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Generates a url for viewing multiple streams simultaneously (Supported: Twitch)
	if (Object.keys(directories[receivedMessage.guild.id].platformsList).includes("stream")) {
		var url = "https://multistre.am/";
		let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);

		if (mentionedGuildMembers.length > 1) {
			let returnText = "";
			var missingUsers = [];
			for (var i = 0; i < mentionedGuildMembers.length; i++) {
				if (mentionedGuildMembers[i] && directories[receivedMessage.guild.id].userDictionary[mentionedGuildMembers[i].id] && directories[receivedMessage.guild.id].userDictionary[mentionedGuildMembers[i].id].stream.value) {
					url += directories[receivedMessage.guild.id].userDictionary[mentionedGuildMembers[i].id].stream.value + "/";
				} else {
					missingUsers.push(mentionedGuildMembers[i].user);
				}
			}

			for (var i = 0; i < state.messageArray.length; i++) {
				if (!isNaN(parseInt(state.messageArray[i]))) {
					url += "layout" + state.messageArray[i];
					break;
				}
			}

			if (missingUsers.length < mentionedGuildMembers.length) {
				returnText += getString(locale, command.module, "multistreamSuccess") + url;
			}

			if (missingUsers.length > 0) {
				returnText += getString(locale, command.module, "errorMissingUsers") + missingUsers.join(", ");
			}

			receivedMessage.author.send(returnText)
				.catch(console.error);
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, command.module, "errorNotEnoughUsers"))
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, command.module, "errorNoPlatform").addVariables({
			"server": receivedMessage.guild.name
		})).catch(console.error);
	}
}

module.exports = command;
