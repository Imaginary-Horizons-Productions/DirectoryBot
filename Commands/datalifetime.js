const Command = require('./../Classes/Command.js');
const { saveObject } = require('./../helpers.js');

var command = new Command(['datalifetime', 'infolifetime'], `Sets the lifetime (in hours) for expiring messages`, true, false, false)
	.addDescription(`This command sets the number of hours before responses from the \`lookup\` and \`send\` commands expire (decimals allowed).`)
	.addSection(`Set the data lifetime`, `\`@DirectoryBot datalifetime (number of hours)\``);

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
		state.infoLifetime = mentionedNumber * 60 * 60 * 1000;
		receivedMessage.channel.send(`The expiring message lifetime has been set to ${mentionedNumber} hour(s).`)
			.catch(console.error);
		saveObject(receivedMessage.guild.id, state.infoLifetime, 'infoLifetime.txt');
	} else {
		// Error Message
		receivedMessage.author.send(`The number for your \`${state.command}\` command could not be parsed.`)
			.catch(console.error);
	}
}

module.exports = command;
