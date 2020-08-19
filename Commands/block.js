const Command = require('./../Classes/Command.js');
const { saveBlockDictionary } = require('./../helpers.js');

var command = new Command(['block'], `Prevents a user from looking up your data`, false, false, false)
	.addDescription(`This command prevents the mentioned user from accessing your data. Unblock a user by using it on the user again.`)
	.addSection(`Block a user`, `\`@DirectoryBot block (user)\``);

command.execute = (receivedMessage, state, metrics) => {
	// Adds the mentioned user to a list that prevents them from checking the author's data
	let mentionedGuildMember = receivedMessage.mentions.users.array().filter(id => id != receivedMessage.client.user.id);

	if (mentionedGuildMember.length > 0) {
		if (!state.cachedGuild.blockDictionary[receivedMessage.author.id]) {
			state.cachedGuild.blockDictionary[receivedMessage.author.id] = [];
		}

		if (!state.cachedGuild.blockDictionary[receivedMessage.author.id].includes(mentionedGuildMember[0].id)) {
			state.cachedGuild.blockDictionary[receivedMessage.author.id].push(mentionedGuildMember[0].id);
			receivedMessage.author.send(`You have blocked ${mentionedGuildMember[0]} from ${receivedMessage.guild}. They won't be able to look up your information.`)
				.catch(console.error);
		} else {
			state.cachedGuild.blockDictionary[receivedMessage.author.id].splice(state.cachedGuild.blockDictionary[receivedMessage.author.id].indexOf(mentionedGuildMember[0].id), 1);
			receivedMessage.author.send(`You have unblocked ${mentionedGuildMember[0]} from ${receivedMessage.guild}.`)
				.catch(console.error);
		}
		saveBlockDictionary(receivedMessage.guild.id, state.cachedGuild.blockDictionary);
	} else {
		// Error Message
		receivedMessage.author.send(`Please mention a user to block.`)
			.catch(console.error);
	}
}

module.exports = command;
