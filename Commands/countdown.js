const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { DateTime, IANAZone, LocalZone } = require("luxon");
var chrono = require('chrono-node');
const { millisecondsToHours } = require('./../helpers.js');

var command = new Command(false, false, true);
command.names = {
	"en_US": ["countdown"]
}

command.summary = {
	"en_US": "How long until the given time"
}

command.description = {
	"en_US": "This command calculates the amount of time until a given time. DirectoryBot uses [tz database format](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for time zones."
}

command.sections = {
	"en_US": [
		new Section("Count down to a time", "`@DirectoryBot countdown (time) in (time zone)`\nIf the time zone is omitted, the countdown will be attempted with the time zone you've recorded for the \"timezone\" platform, then the server's local time zone failing that.")
	]
}

command.execute = (receivedMessage, state, locale) => {
	// Calculates the amount of time until the given date
	var startTimezone = "";
	var timeText = "";
	for (var i = 0; i < state.messageArray.length; i++) {
		if (state.messageArray[i] == "in") {
			startTimezone = state.messageArray[i + 1]
			i++;
		} else {
			timeText += state.messageArray[i] + " ";
		}
	}

	var inputTime = new chrono.parse(timeText);
	if (inputTime.length > 0) {
		if (startTimezone == "") {
			if (state.userDictionary[receivedMessage.author.id].timezone.value) {
				startTimezone = state.userDictionary[receivedMessage.author.id].timezone.value;
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
			receivedMessage.author.send(successMessage[locale].addVariables({
				"startTime": timeText,
				"startTimezone": startTimezone,
				"time": millisecondsToHours(locale, duration.milliseconds, true)
			})).catch(console.error);
		} else {
			// Error message
			receivedMessage.author.send(errorBadZone[locale])
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(errorNoZone[locale])
			.catch(console.error);
	}
}

let successMessage = {
	"en_US": "*${startTime} in ${startTimezone}* is about **${time}** from now."
}

let errorBadZone = {
	"en_US": `The time zone you entered could not be parsed. Remember to use the tz database format for time zones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones`
}

let errorNoZone = {
	"en_US": `The time you provided could not be parsed (remember to specify AM or PM).`
}

module.exports = command;
