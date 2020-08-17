const Command = require('./../Classes/Command.js');
const { saveInfoLifetime } = require('./../helpers.js');

var command = new Command();
command.names = ['infolifetime'];
command.summary = `Sets the lifetime (in hours) for expiring messages`;
command.managerCommand = true;

command.help = (clientUser, state) => {
	return `The *${state.messageArray[0]}* command sets the amount of time in hours before responses from the \`lookup\` and \`send\` commands expire (decimals allowed).
Syntax: ${clientUser}\` ${state.messageArray[0]} (number of hours)\``;
}

command.execute = (receivedMessage, state, metrics) => {
	// Calculates the number of miliseconds corresponding to the given float, then stores as info lifetime
	let mentionedNumber;
	for (const word of state.messageArray) {
		if (!isNaN(parseFloat(word))) {
			mentionedNumber = parseFloat(word);
			break;
        }
	}

	if (mentionedNumber) {
		state.cachedGuild.infoLifetime = mentionedNumber * 60 * 60 * 1000;
		receivedMessage.channel.send(`The expiring message lifetime has been set to ${mentionedNumber} hour(s).`)
			.catch(console.error);
		saveInfoLifetime(receivedMessage.guild.id, state.cachedGuild.infoLifetime);
	} else {
		// Error Message
		receivedMessage.author.send(`The number for your \`infolifetime\` command could not be parsed.`)
			.catch(console.error);
    }
}

module.exports = command;
