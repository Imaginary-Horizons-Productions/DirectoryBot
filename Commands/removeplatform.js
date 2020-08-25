const Command = require('./../Classes/Command.js');
const { savePlatformsList } = require('./../helpers.js');

var command = new Command(["removeplatform"], `Stop recording and distributing user information for a game/service`, true, false, false)
	.addDescription(`This command removes a platform from DirectoryBot's list of platforms for the server.`)
	.addSection(`Remove a platform`, `\`@DirectoryBot removeplatform (platform)\``);

command.execute = (receivedMessage, state, metrics) => {
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
			receivedMessage.channel.send(`${platform} information will no longer be recorded.`)
				.catch(console.error);
			savePlatformsList(receivedMessage.guild.id, state.platformsList);
		} else {
			// Error Message
			receivedMessage.author.send(`${platform} is not currently being recorded in ${receivedMessage.guild}.`)
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(`Please provide a platform to remove.`)
			.catch(console.error);
	}
}

module.exports = command;
