const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { directories, saveObject } = require('./../helpers.js');

var command = new Command("datalifetime", true, false, false);

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
		directories[receivedMessage.guild.id].infoLifetime = mentionedNumber * 60 * 60 * 1000;
		receivedMessage.channel.send(getString(locale, command.module, "successMessage").addVariables({
			"mentionedNumber": mentionedNumber
		})).catch(console.error);
		saveObject(receivedMessage.guild.id, directories[receivedMessage.guild.id].infoLifetime, 'infoLifetime.txt');
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, command.module, "errorBadNumber").addVariables({
			"alias": state.command
		})).catch(console.error);
	}
}

module.exports = command;
