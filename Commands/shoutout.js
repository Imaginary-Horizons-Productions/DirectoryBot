const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { directories } = require('../helpers.js');

var command = new Command("shoutout", false, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Posts the link to a user's recorded stream, currently supported: twitch
	if (Object.keys(directories[receivedMessage.guild.id].platformsList).includes("stream")) {
		let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);
		if (mentionedGuildMembers[0]) {
			var user = mentionedGuildMembers[0];

			if (directories[receivedMessage.guild.id].userDictionary[user.id] && directories[receivedMessage.guild.id].userDictionary[user.id].stream.value) {
				var url = "https://www.twitch.tv/" + directories[receivedMessage.guild.id].userDictionary[user.id].stream.value;

				receivedMessage.channel.send(getString(locale, command.module, "successMessage").addVariables({
					"user": user,
					"url": url
				})).catch(console.error);
			} else {
				// Error Message
				receivedMessage.channel.send(getString(locale, command.module, "errorNoData").addVariables({
					"user": user
				})).catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, command.module, "errorBadUser").addVariables({
				"server": receivedMessage.guild.name
			})).catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, command.module, "errorNoPlatform").addVariables({
			"server": receivedMessage.guild.name
		})).catch(console.error);
	}
}

module.exports = command;
