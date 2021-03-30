const Command = require('../Classes/Command.js');
const { getString } = require('../Localizations/localization.js');
const { guildID, feedbackChannel } = require('../versionData.json');

var command = new Command("feedback", false, false, false);

command.execute = (receivedMessage, state, locale) => {
	// Post feedback to the test server channel and provide the user an invite
	if (guildID && feedbackChannel) {
		var feedback = state.messageArray.join(' ');
		var feedbackPreamble = `Feedback from <@${receivedMessage.author.id}>:\n\t`;
		if (feedback.length < 2000 - feedbackPreamble.length) {
			receivedMessage.client.guilds.fetch(guildID).then(guild => {
				var channel = guild.channels.resolve(feedbackChannel);
				channel.createInvite({ maxAge: 0 }).then(invite => {
					receivedMessage.author.send(getString(locale, command.module, "feedbackMessage") + invite.url)
						.catch(console.error);
				});
				if (receivedMessage.attachments.first()) {
					channel.send(feedbackPreamble + feedback, { files: [receivedMessage.attachments.first().url] })
						.catch(console.error);
				} else {
					channel.send(feedbackPreamble + feedback)
						.catch(console.error);
				}
			})
		} else {
			receivedMessage.author.send("That feedback won't fit in a single discord message. If you can't shorten it, you can save it as a text file and attach the file to the command message.")
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send("The test server is not yet configured for receiving feedback, thanks for your patience.")
			.catch(console.error);
	}
}

module.exports = command;
