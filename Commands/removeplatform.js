const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { saveObject } = require('./../helpers.js');

var command = new Command(true, false, false);
command.names = {
	"en_US": ["removeplatform"]
}

command.summary = {
	"en_US": "Stop recording and distributing user information for a game/service"
}

command.description = {
	"en_US": `This command removes a platform from DirectoryBot's list of platforms for the server.`
}

command.sections = {
	"en_US": [
		new Section(`Remove a platform`, `\`@DirectoryBot removeplatform (platform)\``)
	]
}

command.execute = (receivedMessage, state, locale) => {
	// Removes the given platform
	if (state.messageArray.length > 0) {
		let platform = state.messageArray[0].toLowerCase();

		if (state.platformsList[platform]) {
			Object.keys(state.userDictionary).forEach(userID => {
				if (state.platformsList[platform].roleID) {
					receivedMessage.guild.members.resolve(userID).roles.remove(state.platformsList[platform].roleID);
				}
				delete state.userDictionary[userID][platform];
			})
			delete state.platformsList[platform];
			receivedMessage.channel.send(successMessage[locale].addVariables({
				"platform": platform
			})).catch(console.error);
			saveObject(receivedMessage.guild.id, state.platformsList, 'platformsList.txt');
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
}

let successMessage = {
	"en_US": "${platform} data will no longer be recorded."
}

let errorBadPlatform = {
	"en_US": "${platform} is not currently being recorded in ${server}."
}

let errorNoPlatform = {
	"en_US": "Please provide a platform to remove."
}

module.exports = command;
