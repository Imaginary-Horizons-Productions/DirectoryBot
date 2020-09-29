const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { DateTime, IANAZone, LocalZone } = require("luxon");
var chrono = require('chrono-node');
const { directories, millisecondsToHours } = require('./../helpers.js');

var command = new Command("countdown", false, false, true);

command.execute = (receivedMessage, state, locale) => {
	// Calculates the amount of time until the given date
	var startTimezone = "";
	var timeText = "";
	for (var i = 0; i < state.messageArray.length; i++) {
		if (state.messageArray[i] == getString(locale, command.module, "in")) {
			startTimezone = state.messageArray[i + 1]
			i++;
		} else {
			timeText += state.messageArray[i] + " ";
		}
	}

	var inputTime = new chrono.parse(timeText);
	if (inputTime.length > 0) {
		if (startTimezone == "") {
			if (directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id].timezone.value) {
				startTimezone = directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id].timezone.value;
			} else {
				startTimezone = LocalZone.instance.name;
			}
		}

		if (IANAZone.isValidZone(startTimezone)) {
			inputTime[0].start.assign("timezoneOffset", IANAZone.create(startTimezone).offset(Date.now()));
			var dateTimeObject = DateTime.fromJSDate(inputTime[0].start.date());
			var duration = dateTimeObject.diffNow("milliseconds").normalize();
			if (duration.milliseconds < 0) {
				duration = duration.plus(86400000); // 86400000 is a day in milliseconds
				duration.normalize();
			}
			receivedMessage.author.send(getString(locale, command.module, "successMessage").addVariables({
				"startTime": timeText,
				"startTimezone": startTimezone,
				"time": millisecondsToHours(locale, duration.milliseconds, true)
			})).catch(console.error);
		} else {
			// Error message
			receivedMessage.author.send(getString(locale, command.module, "errorBadZone"))
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, command.module, "errorBadTime"))
			.catch(console.error);
	}
}

module.exports = command;
