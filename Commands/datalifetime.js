const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { saveObject } = require('./../helpers.js');

var command = new Command(true, false, false);
command.names = {
	"en_US": ['datalifetime', 'infolifetime']
}

command.summary = {
	"en_US": "Sets the lifetime (in hours) for expiring messages"
}

command.description = {
	"en_US": "This command sets the number of hours before responses from the `lookup` and `send` commands expire (decimals allowed)."
}

command.sections = {
	"en_US": [
		new Section("Set the data lifetime", "`@DirectoryBot datalifetime (number of hours)`")
	]
}

command.execute = (receivedMessage, state, locale) => {
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
		receivedMessage.channel.send(successMessage[locale].addVariables({
			"mentionedNumber": mentionedNumber
		})).catch(console.error);
		saveObject(receivedMessage.guild.id, state.infoLifetime, 'infoLifetime.txt');
	} else {
		// Error Message
		receivedMessage.author.send(errorBadNumber[locale].addVariables({
			"alias": state.command
		})).catch(console.error);
	}
}

let successMessage = {
	"en_US": "The expiring message lifetime has been set to ${mentionedNumber} hour(s)."
}

let errorBadNumber = {
	"en_US": "The number for your `${alias}` command could not be parsed."
}

module.exports = command;
