const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { directories, saveObject } = require('./../helpers.js');

var command = new Command("setplatformrole", true, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Sets a role to automatically give to users who set information for the given platform
	if (state.messageArray.length > 0) {
		var platform = state.messageArray[0];
		var role = receivedMessage.mentions.roles.array()[0];

		if (directories[receivedMessage.guild.id].platformsList[platform]) {
			if (role) {
				directories[receivedMessage.guild.id].platformsList[platform].roleID = role.id;
				directories[receivedMessage.guild.id].platformsList[platform].roleName = role.name;
				Object.keys(directories[receivedMessage.guild.id].userDictionary).forEach(userID => {
					receivedMessage.guild.members.resolve(userID).addPlatformRoles(directories[receivedMessage.guild.id]);
				})
				receivedMessage.channel.send(getString(locale, command.module, "successMessage").addVariables({
					"platform": platform,
					"term": directories[receivedMessage.guild.id].platformsList[platform].term,
					"role": role
				})).catch(console.error);
			} else {
				if (directories[receivedMessage.guild.id].platformsList[platform].roleID) {
					Object.keys(directories[receivedMessage.guild.id].userDictionary).forEach(userID => {
						if (Object.keys(directories[receivedMessage.guild.id].userDictionary[userID]).includes(platform)) {
							receivedMessage.guild.members.resolve(userID).roles.remove(directories[receivedMessage.guild.id].platformsList[platform].roleID);
						}
					})
					directories[receivedMessage.guild.id].platformsList[platform].roleID = "";
					directories[receivedMessage.guild.id].platformsList[platform].roleName = "";
				}
				receivedMessage.channel.send(getString(locale, command.module, "clearMessage").addVariables({
					"platform": platform
				})).catch(console.error);
			}
			saveObject(receivedMessage.guild.id, directories[receivedMessage.guild.id].platformsList, 'platformsList.txt');
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
