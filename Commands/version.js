const Command = require('../Classes/Command.js');
const { versionBuilder } = require('../helpers.js');

var command = new Command("version", false, false, true);

command.help = (avatarURL, guildID, locale, guildName, module) => {
	receivedMessage.author.send(versionBuilder(avatarURL))
		.catch(console.error);
}

command.execute = (receivedMessage, state, locale) => {
	// Command specifications go here
	if (state.messageArray.length > 0 && state.messageArray[0] == "full") {
		receivedMessage.author.send({
			files: [{
				attachment: "./ChangeLog.md",
				name: "DirectoryBotChangeLog.md"
			}]
		}).catch(console.error);
	} else {
		receivedMessage.author.send(versionBuilder(receivedMessage.client.user.displayAvatarURL()))
			.catch(console.error);
	}
}

module.exports = command;
