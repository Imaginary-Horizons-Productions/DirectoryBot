const Command = require('./../Classes/Command.js');
const { savePlatformsList } = require('./../helpers.js');

var command = new Command(["setplatformterm", "changeplatformterm"], `Changes what DirectoryBot calls information for the given platform`, true, false, false)
	.addDescription(`This command changes what DirectoryBot calls data for the given platform (default is "username").`)
	.addSection(`Change a platform's data term`, `\`@DirectoryBot setplatformterm (platform) (data term)\``);

command.execute = (receivedMessage, state, metrics) => {
	// Changes the term used to refer to information for a given platform
	if (state.messageArray.length > 0) {
		if (state.messageArray.length > 1) {
			let platform = state.messageArray[0].toLowerCase();
			let term = state.messageArray[1];

			if (state.platformsList[platform]) {
				state.platformsList[platform].term = term;
				receivedMessage.author.send(`Information for *${platform}* will now be referred to as **${term}** in ${receivedMessage.guild}.`)
					.catch(console.error);
				savePlatformsList(receivedMessage.guild.id, state.platformsList);
			} else {
				// Error Message
				receivedMessage.author.send(`${platform} is not currently being recorded in ${receivedMessage.guild}.`)
					.catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(`Please provide a term to change to for the platform.`)
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(`Please provide a platform for which to change the term.`)
			.catch(console.error);
	}
}

module.exports = command;
