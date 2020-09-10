const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');

var command = new Command(false, false, false);
command.names = {
	"en_US": ["multistream", "multitwitch"]
}

command.summary = {
	"en_US": "Generate a multistream link for the given users"
}

command.description = {
	"en_US": "This command generates a link to watch multiple streams simultaneously. Optionally, you can enter the layout number last if you want to specify that."
}

command.sections = {
	"en_US": [
		new Section("Generate multistream link", "`@DirectoryBot multistream (users) (layout)`")
	]
}

command.execute = (receivedMessage, state, metrics) => {
	// Generates a url for viewing multiple streams simultaneously (Supported: Twitch)
	if (Object.keys(state.platformsList).includes("stream")) {
		var url = "https://multistre.am/";
		let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);

		if (mentionedGuildMembers.length > 1) {
			let returnText = "";
			var missingUsers = [];
			for (var i = 0; i < mentionedGuildMembers.length; i++) {
				if (mentionedGuildMembers[i] && state.userDictionary[mentionedGuildMembers[i].id] && state.userDictionary[mentionedGuildMembers[i].id].stream.value) {
					url += state.userDictionary[mentionedGuildMembers[i].id].stream.value + "/";
				} else {
					missingUsers.push(mentionedGuildMembers[i].user);
				}
			}

			for (var i = 0; i < state.messageArray.length; i++) {
				if (!isNaN(parseInt(state.messageArray[i]))) {
					url += "layout" + state.messageArray[i];
					break;
				}
			}

			if (missingUsers.length < mentionedGuildMembers.length) {
				returnText += multistreamSuccess[locale] + url;
			}

			if (missingUsers.length > 0) {
				returnText += errorMissingUsers[locale] + missingUsers.join(", ");
			}

			receivedMessage.author.send(returnText)
				.catch(console.error);
		} else {
			// Error Message
			receivedMessage.author.send(errorNotEnoughUsers[locale])
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(errorNoPlatform.addVariables({
			"server": receivedMessage.guild.name
		})).catch(console.error);
	}
}

let multistreamSuccess = {
	"en_US": "Here's the multistream link: "
}

let errorMissingUsers = {
	"en_US": "\n\nThe following users don't have stream info recorded: "
}

let errorNotEnoughUsers = {
	"en_US": "Please mention at least two users to generate a multistream link for."
}

let errorNoPlatform = {
	"en_US": "Your multistream command could not be completed. ${server} does not seem to be tracking stream information."
}

module.exports = command;
