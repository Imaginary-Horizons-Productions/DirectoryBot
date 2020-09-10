const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { saveObject } = require('./../helpers.js');

var command = new Command(false, false, false);
command.names = {
	"en_US": ["record", "log", "add"]
}

command.summary = {
	"en_US": "Record your information for a platform"
}

command.description = {
	"en_US": "This command adds your information for given platform so people can ask the bot for it."
}

command.sections = {
	"en_US": [
		new Section("Recording data", "`@DirectoryBot record (platform) (data)`\nThe message containing the command will be deleted for security purposes. Discord's spoilers markdown (|| on both sides) is removed from code entry to allow hiding entry from mobile via spoilers markdown.")
	]
}

command.execute = (receivedMessage, state, metrics) => {
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
				receivedMessage.delete().then(message => message.channel.send(successMessage[locale].addVariables({
					"author": message.author,
					"platform": platform,
					"term": state.platformsList[platform].term,
					"botNickname": message.client.user
				})).catch(console.error));
				saveObject(receivedMessage.guild.id, state.userDictionary, 'userDictionary.txt');
			} else {
				// Error Message
				receivedMessage.author.send(errorBadPlatform[locale].addVariables({
					"platform": platform,
					"server": receivedMessage.guild
				})).catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(errorNoData[locale])
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(errorNoPlatform[locale])
			.catch(console.error);
	}
}

let successMessage = {
	"en_US": "${author} has recorded a ${platform} ${term}. Check it with:\n\t${botNickname}` lookup `${author}` ${platform}`."
}

let errorBadPlatform = {
	"en_US": "${platform} is not currently being tracked in ${server}."
}

let errorNoData = {
	"en_US": "Please provide the information you would like to record."
}

let errorNoPlatform = {
	"en_US": "Please provide a platform for which to record your information for."
}

module.exports = command;
