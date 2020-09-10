const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { MessageMentions } = require('discord.js');
const Platform = require('./../Classes/Platform.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { saveObject } = require('./../helpers.js');

var command = new Command(true, false, false);
command.names = {
	"en_US": ["newplatform", "addplatform"]
}

command.summary = {
	"en_US": "Setup a new game/service for users to record or retrieve information for"
}

command.description = {
	"en_US": `This command sets up a new game/service for users to record and retrieve information.`
}

command.sections = {
	"en_US": [
		new Section(`Create a new platform`, "`@DirectoryBot newplatform (platform name) (information term) (description)`\nOptionally, you can set a term to call the information that is being stored (default is \"username\"). Additionally, you can set an optional description to be displayed when the lookup command is used on the platform.")
	]
}

command.execute = (receivedMessage, state, locale) => {
	// Adds a new platform to track
	if (state.messageArray.length > 0) {
		let messageArray = state.messageArray;
		let platform = messageArray.shift().toLowerCase();
		let term = messageArray.shift();
		let description = messageArray.join(' ');

		if (!platform.match(MessageMentions.USERS_PATTERN)) {
			if (!state.platformsList[platform]) {
				state.platformsList[platform] = new Platform(term, description);
				Object.keys(state.userDictionary).forEach(userID => {
					state.userDictionary[userID][platform] = new FriendCode();
				})
				receivedMessage.channel.send(successMessage[locale].addVariables({
					"platform": platform,
					"term": state.platformsList[platform].term
				})).catch(console.error);
				saveObject(receivedMessage.guild.id, state.platformsList, 'platformsList.txt');
			} else {
				// Error Message
				receivedMessage.author.send(errorDupePlatform[locale].addVariables({
					"server": receivedMessage.guild.name,
					"platform": platform
				})).catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(errorNoUserNamedPlatforms[locale])
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(errorNoName[locale])
			.catch(console.error);
	}
}

let successMessage = {
	"en_US": "${platform} ${term}s can now be recorded and retrieved."
}

let errorDupePlatform = {
	"en_US": "${server} already has a platform named *${platform}*."
}

let errorNoUserNamedPlatforms = {
	"en_US": "Please select a platform name that is not a user mention."
}

let errorNoName = {
	"en_US": "Please provide a name for the new platform."
}

module.exports = command;
