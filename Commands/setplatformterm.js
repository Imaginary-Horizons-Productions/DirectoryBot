const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { saveObject } = require('./../helpers.js');

var command = new Command(true, false, false);
command.names = {
	"en_US": ["setplatformterm", "changeplatformterm"]
}

command.summary = {
	"en_US": "Changes what DirectoryBot calls information for the given platform"
}

command.description = {
	"en_US": `This command changes what DirectoryBot calls data for the given platform (default is "username").`
}

command.sections = {
	"en_US": [
		new Section("Change a platform's data term", "`@DirectoryBot setplatformterm (platform) (data term)`")
	]
}

command.execute = (receivedMessage, state, locale) => {
	// Changes the term used to refer to information for a given platform
	if (state.messageArray.length > 0) {
		if (state.messageArray.length > 1) {
			let platform = state.messageArray[0].toLowerCase();
			let term = state.messageArray[1];

			if (state.platformsList[platform]) {
				state.platformsList[platform].term = term;
				receivedMessage.author.send(successMessage[locale].addVariables({
					"platform": platform,
					"term": term,
					"server": receivedMessage.guild.name
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
			receivedMessage.author.send(errorNoTerm[locale])
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(errorNoPlatform[locale])
			.catch(console.error);
	}
}

let successMessage = {
	"en_US": "Information for *${platform}* will now be referred to as **${term}** in ${server}."
}

let errorBadPlatform = {
	"en_US": "${platform} is not currently being recorded in ${server}."
}

let errorNoTerm = {
	"en_US": "Please provide a term to change to for the platform."
}

let errorNoPlatform = {
	"en_US": "Please provide a platform for which to change the term."
}

module.exports = command;
