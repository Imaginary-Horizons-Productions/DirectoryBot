const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { supportedLocales } = require('./../localization.js');
const { guildLocales } = require('./../helpers.js');

var command = new Command(true, false, false);
command.names = {
	"en_US": ['setlocale', 'setlanguage']
}

command.summary = {
	"en_US": "Sets the locale (language) for the server"
}

command.description = {
	"en_US": "This command sets the default locale (language) for the server it is used in (default: en_US)."
}

command.sections = {
	"en_US": [
		new Section("Set the default locale", "`@DirectoryBot ${commandAlias} setlocale (locale)`"),
		new Section("Contributing localization", "If you'd like to contribute to localizing, check out our [GitHub](https://github.com/Imaginary-Horizons-Productions/DirectoryBot). Currently supported: " + supportedLocales.join(', '))
	]
}

command.execute = (receivedMessage, state, locale) => {
	// Set the default locale for the guild the command was received in
	let localeInput = state.messageArray[0];
	if (localeInput) {
		if (supportedLocales.includes(localeInput)) {
			guildLocales[receivedMessage.guild.id] = localeInput;
			receivedMessage.channel.send(successMessage[locale].addVariables({
				"locale": state.messageArray[0]
			})).catch(console.error);
		} else {
			// Error Message
			receivedMessage.author.send(errorBadLocale[locale].addVariables({
				"supportedLocales": supportedLocales.join(', ')
			})).catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(errorNoLocale[locale].addVariables({
			"server": receivedMessage.guild.name
		})).catch(console.error);
	}
}

let successMessage = {
	"en_US": "The default locale has been set to: ${locale}"
}

let errorBadLocale = {
	"en_US": "The locale you provided is not currently supported. Currently supported: ${supportedLocales}\n\nIf you'd like to contribute to localizing, check out our GitHub (https://github.com/Imaginary-Horizons-Productions/DirectoryBot)."
}

let errorNoLocale = {
	"en_US": "Please provide a locale to set as the default for ${server}."
}

module.exports = command;
