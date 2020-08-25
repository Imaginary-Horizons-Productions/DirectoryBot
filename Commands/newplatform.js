const Command = require('./../Classes/Command.js');
const { MessageMentions } = require('discord.js');
const PlatformData = require('./../Classes/PlatformData.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { saveObject } = require('./../helpers.js');

var command = new Command(["newplatform", "addplatform"], `Setup a new game/service for users to record or retrieve information for`, true, false, false)
	.addDescription(`This command sets up a new game/service for users to record and retrieve information.`)
	.addSection(`Create a new platform`, `\`@DirectoryBot newplatform (platform name) (information term) (description)\`\nOptionally, you can set a term to call the information that is being stored (default is "username"). Additionally, you can set an optional description to be displayed when the lookup command is used on the platform.`);

command.execute = (receivedMessage, state, metrics) => {
	// Adds a new platform to track
	if (state.messageArray.length > 0) {
		let messageArray = state.messageArray;
		let platform = messageArray.shift().toLowerCase();
		let term = messageArray.shift();
		let description = messageArray.join(' ');

		if (!platform.match(MessageMentions.USERS_PATTERN)) {
			if (!state.platformsList[platform]) {
				state.platformsList[platform] = new PlatformData(term, description);
				Object.keys(state.userDictionary).forEach(userID => {
					state.userDictionary[userID][platform] = new FriendCode();
				})
				receivedMessage.channel.send(`${platform} ${state.platformsList[platform].term}s can now be recorded and retrieved.`)
					.catch(console.error);
				saveObject(receivedMessage.guild.id, state.platformsList, 'platformsList.txt');
			} else {
				// Error Message
				receivedMessage.author.send(`${receivedMessage.guild} already has a platform named *${platform}*.`)
					.catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(`Please select a platform name that is not a user mention.`)
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(`Please provide a name for the new platform.`)
			.catch(console.error);
	}
}

module.exports = command;
