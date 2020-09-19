const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { saveObject } = require('./../helpers.js');

var command = new Command("setplatformrole", true, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Sets a role to automatically give to users who set information for the given platform
	if (state.messageArray.length > 0) {
		var platform = state.messageArray[0];
		var role = receivedMessage.mentions.roles.array()[0];

		if (state.platformsList[platform]) {
			if (role) {
				state.platformsList[platform].roleID = role.id;
				state.platformsList[platform].roleName = role.name;
				Object.keys(state.userDictionary).forEach(userID => {
					receivedMessage.guild.members.resolve(userID).addPlatformRoles(state);
				})
				receivedMessage.channel.send(getString(locale, command.module, "successMessage").addVariables({
					"platform": platform,
					"term": state.platformsList[platform].term,
					"role":role
				})).catch(console.error);
			} else {
				if (state.platformsList[platform].roleID) {
					Object.keys(state.userDictionary).forEach(userID => {
						if (Object.keys(state.userDictionary[userID]).includes(platform)) {
							receivedMessage.guild.members.resolve(userID).roles.remove(state.platformsList[platform].roleID);
						}
					})
					state.platformsList[platform].roleID = "";
					state.platformsList[platform].roleName = "";
				}
				receivedMessage.channel.send(getString(locale, command.module, "clearMessage").addVariables({
					"platform": platform
				})).catch(console.error);
			}
			saveObject(receivedMessage.guild.id, state.platformsList, 'platformsList.txt');
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, command.module, "errorBadPlatform").addVariables({
				"server": receivedMessage.guild.name,
				"platform": platform
			})).catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, command.module, "errorNoPlatform"))
			.catch(console.error);
	}
}

module.exports = command;
