const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');

var command = new Command("shoutout", false, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Posts the link to a user's recorded stream, currently supported: twitch
	if (Object.keys(state.platformsList).includes("stream")) {
		let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);
		if (mentionedGuildMembers[0]) {
			var user = mentionedGuildMembers[0];

			if (state.userDictionary[user.id] && state.userDictionary[user.id].stream.value) {
				var url = "https://www.twitch.tv/" + state.userDictionary[user.id].stream.value;

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
