const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { DateTime, IANAZone, LocalZone } = require("luxon");
var chrono = require('chrono-node');

var command = new Command(false, false, true);
command.names = {
	"en_US": ["convert"]
}

command.summary = {
	"en_US": "Convert a time to someone else's time zone or a given time zone"
}

command.description = {
	"en_US": "This command calculates a time for a given user or time zone. DirectoryBot uses [tz database format](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for time zones."
}

command.sections = {
	"en_US": [
		new Section("Convert a time to a user's time zone", "`@DirectoryBot convert (time) in (start time zone) for (user)`"),
		new Section("Convert a time to a specified time zone", "`@DirectoryBot convert (time) in (start time zone) to (result time zone)`"),
		new Section("\u200B", "If the starting timezone is omitted, the conversion will be attempted with the time zone you've recorded for the \"timezone\" platform.")
	]
}

command.execute = (receivedMessage, state, locale) => {
	// Calculates the time for a user or time zone, given an inital time zone
	let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);
	var timeText = "";
	var startTimezone = "";
	var resultTimezone;

	if (mentionedGuildMembers.length == 1) {
		let targetGuildMember = mentionedGuildMembers[0];
		if (Object.keys(state.platformsList).includes("timezone")) {
			if (targetGuildMember) {
				if (state.userDictionary[targetGuildMember.id] && state.userDictionary[targetGuildMember.id].timezone) {
					for (var i = 0; i < state.messageArray.length; i++) {
						if (state.messageArray[i] == "in") {
							startTimezone = state.messageArray[i + 1]
							i++;
						} else if (state.messageArray[i] == "for") {
							break;
						} else {
							timeText += state.messageArray[i] + " ";
						}
					}
					resultTimezone = state.userDictionary[targetGuildMember.id].timezone.value;
				} else {
					// Error Message
					receivedMessage.author.send(errorUserZoneMissing[locale].addVariables({
						"targetGuildMember": targetGuildMember,
					})).catch(console.error);
					return;
				}
			} else {
				// Error Message
				receivedMessage.author.send(errorNotAMember[locale].addVariables({
					"targetGuildMember": targetGuildMember,
					"server": receivedMessage.guild.toString()
				})).catch(console.eror);
				return;
			}
		} else {
			// Error Message
			receivedMessage.author.send(errorNoPlatform[locale].addVariables({
				"server": receivedMessage.guild.toString()
			})).catch(console.error);
			return;
		}
	} else {
		for (var i = 0; i < state.messageArray.length; i++) {
			if (state.messageArray[i] == "in") {
				startTimezone = state.messageArray[i + 1]
				i++;
			} else if (state.messageArray[i] == "to") {
				resultTimezone = state.messageArray[i + 1];
				break;
			} else {
				timeText += state.messageArray[i] + " ";
			}
		}
	}

	if (startTimezone == "") {
		if (state.userDictionary[receivedMessage.author.id].timezone.value) {
			startTimezone = state.userDictionary[receivedMessage.author.id].timezone.value;
		} else {
			startTimezone = LocalZone.instance.name;
		}
	}

	if (IANAZone.isValidZone(startTimezone)) {
		if (resultTimezone) {
			if (IANAZone.isValidZone(resultTimezone)) {
				var inputTime = new chrono.parse(timeText);
				if (inputTime.length > 0) {
					inputTime[0].start.assign("timezoneOffset", IANAZone.create(startTimezone).offset(Date.now()));
					var dateTimeObject = DateTime.fromJSDate(inputTime[0].start.date(), { zone: startTimezone });
					var convertedDateTime = dateTimeObject.setZone(resultTimezone);

					if (mentionedGuildMembers.length == 1) {
						receivedMessage.author.send(successUser[locale].addVariables({
							"originalTime": timeText,
							"originalTimeZone": startTimezone,
							"destinationTime": convertedDateTime.toLocaleString(DateTime.TIME_24_SIMPLE),
							"targetGuildMember": targetGuildMember
						})).catch(console.error);
					} else {
						receivedMessage.author.send(successZone[locale].addVariables({
							"originalTime": timeText,
							"originalTimeZone": startTimezone,
							"destinationTime": convertedDateTime.toLocaleString(DateTime.TIME_24_SIMPLE),
							"destinationTimeZone": resultTimezone
						})).catch(console.error);
					}
				} else {
					// Error Message
					receivedMessage.author.send(errorBadTime[locale])
						.catch(console.error);
				}
			} else {
				// Error Message
				receivedMessage.author.send(errorBadResultZone[locale])
					.catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(errorNoResultZone[locale])
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(errorBadStartZone[locale])
			.catch(console.error);
	}
}

let errorUserZoneMissing = {
	"en_US": "Your time could not be converted. ${targetGuildMember} does not have a time zone recorded."
}

let errorNotAMember = {
	"en_US": "Your time could not be converted. ${targetGuildMember} isn't a member of ${server}."
}

let errorNoPlatform = {
	"en_US": "Your time could not be converted. ${server} does not seem to be tracking time zones."
}

let successUser = {
	"en_US": "*${originalTime}in ${originalTimeZone}* is **${destinationTime} for ${targetGuildMember}**."
}

let successZone = {
	"en_US": "*${originalTime}in ${originalTimeZone}* is **${destinationTime} in {destinationTimeZone}**."
}

let errorBadTime = {
	"en_US": "The time you provided could not be parsed (remember to specify AM or PM)."
}

let errorBadResultZone = {
	"en_US": "Please use the IANA timezone format for the **result timezone**. You can look up timezones here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"
}

let errorNoResultZone = {
	"en_US": "Please specify a result timezone for your `convert` command."
}

let errorBadStartZone = {
	"en_US": "Please use the IANA timezone format for the **starting timezone**. You can look up timezones here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"
}

module.exports = command;
