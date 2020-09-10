const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');

var command = new Command(false, false, false);
command.names = {
	"en_US": ["shoutout", "streamshoutout"]
}

command.summary = {
	"en_US": "Have DirectoryBot post someone's stream information"
}

command.description = {
	"en_US": "This command posts the given user's stream information."
}

command.sections = {
	"en_US": [
		new Section("Give a stream shoutout", "`@DirectoryBot shoutout (user)`")
	]
}

command.execute = (receivedMessage, state, locale) => {
	// Posts the link to a user's recorded stream, currently supported: twitch
	if (Object.keys(state.platformsList).includes("stream")) {
		let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);
		if (mentionedGuildMembers[0]) {
			var user = mentionedGuildMembers[0];

			if (state.userDictionary[user.id] && state.userDictionary[user.id].stream.value) {
				var url = "https://www.twitch.tv/" + state.userDictionary[user.id].stream.value;

				receivedMessage.channel.send(successMessage[locale].addVariables({
					"user": user,
					"url": url
				})).catch(console.error);
			} else {
				// Error Message
				receivedMessage.channel.send(errorNoData[locale].addVariables({
					"user": user
				})).catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(errorBadUser[locale].addVariables({
				"server": receivedMessage.guild.name
			})).catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(errorNoPlatform[locale].addVariables({
			"server": receivedMessage.guild.name
		})).catch(console.error);
	}
}

let successMessage = {
	"en_US": "Check out ${user}'s stream at ${url} !"
}

let errorNoData = {
	"en_US": "${user} has not set a stream username in this server's DirectoryBot yet."
}

let errorBadUser = {
	"en_US": "That person isn't a member of ${server}."
}

let errorNoPlatform = {
	"en_US": "Your `shoutout` command could not be completed. ${server} does not seem to have a \"stream\" platform."
}

module.exports = command;
