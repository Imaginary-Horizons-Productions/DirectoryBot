const Command = require('./../Classes/Command.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { saveObject } = require('./../helpers.js');

var command = new Command(["record", "log", "add"], `Record your information for a platform`, false, false, false)
	.addDescription(`This command adds your information for given platform so people can ask the bot for it.`)
	.addSection(`Recording data`, `\`@DirectoryBot record (platform) (data)\`\nThe message containing the command will be deleted for security purposes. Discord's spoilers markdown (|| on both sides) is removed from code entry to allow hiding entry from mobile via spoilers markdown.`);

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
				receivedMessage.delete().then(message => message.channel.send(`${message.author} has recorded a ${platform} ${state.platformsList[platform].term}. Check it with:\n\t${message.client.user}\` lookup \`${message.author}\` ${platform}\`.`)
					.catch(console.error));
				saveObject(receivedMessage.guild.id, state.userDictionary, 'userDictionary.txt');
			} else {
				// Error Message
				receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`)
					.catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(`Please provide the information you would like to record.`)
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(`Please provide a platform for which to record your information for.`)
			.catch(console.error);
	}
}

module.exports = command;
