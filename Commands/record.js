const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { saveObject } = require('./../helpers.js');

var command = new Command("record", false, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Records a user's information for a given platform
	var platform = state.messageArray[0];
	if (platform) {
		platform = platform.toLowerCase();
		if (state.messageArray.length > 1) {
			var codeArray = state.messageArray.slice(1);
			let spoilerMarkdown = /\|\|/g;
			let friendcode = codeArray.join(" ").replace(spoilerMarkdown, '');

			if (Object.keys(state.platformsList).includes(platform)) { // Early out if platform is not being tracked
				if (!state.userDictionary[receivedMessage.author.id][platform]) {
					state.userDictionary[receivedMessage.author.id][platform] = new FriendCode();
				}

				state.userDictionary[receivedMessage.author.id][platform].value = friendcode;
				receivedMessage.member.addPlatformRoles(state);
				receivedMessage.delete().then(message => message.channel.send(getString(locale, command.module, "successMessage").addVariables({
					"author": message.author,
					"platform": platform,
					"term": state.platformsList[platform].term,
					"botNickname": message.client.user
				})).catch(console.error));
				saveObject(receivedMessage.guild.id, state.userDictionary, 'userDictionary.txt');
			} else {
				// Error Message
				receivedMessage.author.send(getString(locale, command.module, "errorBadPlatform").addVariables({
					"platform": platform,
					"server": receivedMessage.guild
				})).catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, command.module, "errorNoData"))
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, command.module, "errorNoPlatform"))
			.catch(console.error);
	}
}

module.exports = command;
