const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { saveBlockDictionary } = require('./../helpers.js');

var command = new Command(false, false, false);
command.names = {
	"en_US": ['block']
}

command.summary = {
	"en_US": "Prevents a user from looking up your data"
}

command.description = {
	"en_US": "This command prevents the mentioned user from accessing your data. Unblock a user by using it on the user again."
}

command.sections = {
	"en_US": [
		new Section("Block a user", "`@DirectoryBot block (user)`")
	]
}

command.execute = (receivedMessage, state, locale) => {
	// Adds the mentioned user to a list that prevents them from checking the author's data
	let mentionedGuildMember = receivedMessage.mentions.users.array().filter(id => id != receivedMessage.client.user.id);

	if (mentionedGuildMember.length > 0) {
		if (!state.blockDictionary[receivedMessage.author.id]) {
			state.blockDictionary[receivedMessage.author.id] = [];
		}

		if (!state.blockDictionary[receivedMessage.author.id].includes(mentionedGuildMember[0].id)) {
			state.blockDictionary[receivedMessage.author.id].push(mentionedGuildMember[0].id);
			receivedMessage.author.send(blockMessage[locale].addVariables({
				"blockedPerson": mentionedGuildMember[0],
				"server": receivedMessage.guild
			})).catch(console.error);
		} else {
			state.blockDictionary[receivedMessage.author.id].splice(state.blockDictionary[receivedMessage.author.id].indexOf(mentionedGuildMember[0].id), 1);
			receivedMessage.author.send(unblockMessage[locale].addVariables({
				"unblockedPerson": mentionedGuildMember[0],
				"server": receivedMessage.guild
			})).catch(console.error);
		}
		saveBlockDictionary(receivedMessage.guild.id, state.blockDictionary);
	} else {
		// Error Message
		receivedMessage.author.send(errorNoMention[locale])
			.catch(console.error);
	}
}

let blockMessage = {
	"en_US": "You have blocked ${blockedPerson} from ${server}. They won't be able to look up your information."
}

let unblockMessage = {
	"en_US": "You have unblocked ${unblockedPerson} from ${server}."
}

let errorNoMention = {
	"en_US": "Please mention a user to block."
}

module.exports = command;
