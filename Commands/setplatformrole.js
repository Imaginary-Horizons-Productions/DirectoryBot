const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { saveObject } = require('./../helpers.js');

var command = new Command(true, false, false);
command.names = {
	"en_US": ["setplatformrole"]
}

command.summary = {
	"en_US": "Automatically give a role to users who record information for a platform"
}

command.description = {
	"en_US": "This command associates the given role and platform. Anyone who records information for that platform will be automatically given the associated role. Using the command without mentioning a role clears the set role for the platform."
}

command.sections = {
	"en_US": [
		new Section("Set a platform role", "`@DirectoryBot setplatformrole (platform) (role)`"),
		new Section("Clear a platform role", "`@DirectoryBot setplatformrole (platform)`")
	]
}

command.execute = (receivedMessage, state, locale) => {
	// Sets a role to automatically give to users who set information for the given platform
	if (state.messageArray.length > 0) {
		var platform = state.messageArray[0];
		var role = receivedMessage.mentions.roles.array()[0];

		if (state.platformsList[platform]) {
			if (role) {
				state.platformsList[platform].roleID = role.id;
				Object.keys(state.userDictionary).forEach(userID => {
					receivedMessage.guild.members.resolve(userID).addPlatformRoles(state);
				})
				receivedMessage.channel.send(successMessage[locale].addVariables({
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
				}
				receivedMessage.channel.send(clearMessage[locale].addVariables({
					"platform": platform
				})).catch(console.error);
			}
			saveObject(receivedMessage.guild.id, state.platformsList, 'platformsList.txt');
		} else {
			// Error Message
			receivedMessage.author.send(errorBadPlatform[locale].addVariables({
				"server": receivedMessage.guild.name,
				"platform": platform
			})).catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(errorNoPlatform[locale])
			.catch(console.error);
	}
}

let successMessage = {
	"en_US": "Server members who set a ${platform} ${term} will now automatically be given the role ${role}."
}

let clearMessage = {
	"en_US": "The ${platform} role has been cleared."
}

let errorBadPlatform = {
	"en_US": "${server} doesn't have a platform named ${platform}."
}

let errorNoPlatform = {
	"en_US": "Please provide a platform to set a role for."
}

module.exports = command;
