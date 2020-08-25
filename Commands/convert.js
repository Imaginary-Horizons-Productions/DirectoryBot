const Command = require('./../Classes/Command.js');
const { DateTime, IANAZone, LocalZone } = require("luxon");
var chrono = require('chrono-node');

var command = new Command(["convert"], `Convert a time to someone else's time zone or a given time zone`, false, false, true)
	.addDescription(`This command calculates a time for a given user or time zone. DirectoryBot uses [tz database format](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for time zones.`)
	.addSection(`Convert a time to a user's time zone`, `\`@DirectoryBot convert (time) in (start time zone) for (user)\``)
	.addSection(`Convert a time to a specified time zone`, `\`@DirectoryBot convert (time) in (start time zone) to (result time zone)\``)
	.addSection(`\u200B`, `If the starting timezone is omitted, the conversion will be attempted with the time zone you've recorded for the "timezone" platform.`);

command.execute = (receivedMessage, state, metrics) => {
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
					receivedMessage.author.send(`Your time could not be converted to ${targetGuildMember}'s time zone. ${targetGuildMember} does not have a time zone recorded.`)
						.catch(console.error);
					return;
				}
			} else {
				// Error Message
				receivedMessage.author.send(`Your time could not be converted to ${targetGuildMember}'s time zone. ${targetGuildMember} isn't a member of ${receivedMessage.guild}.`)
					.catch(console.eror);
				return;
			}
		} else {
			// Error Message
			receivedMessage.author.send(`Your time could not be converted. ${receivedMessage.guild} does not seem to be tracking time zones.`)
				.catch(console.error);
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
						receivedMessage.author.send(`*${timeText}in ${startTimezone}* is **${convertedDateTime.toLocaleString(DateTime.TIME_24_SIMPLE)}** for ${mentionedGuildMembers[0]}.`)
							.catch(console.error);
					} else {
						receivedMessage.author.send(`*${timeText}in ${startTimezone}* is **${convertedDateTime.toLocaleString(DateTime.TIME_24_SIMPLE)} in ${resultTimezone}**.`)
							.catch(console.error);
					}
				} else {
					// Error Message
					receivedMessage.author.send(`The time you provided could not be parsed (remember to specify AM or PM).`)
						.catch(console.error);
				}
			} else {
				// Error Message
				receivedMessage.author.send(`Please use the tz database format for the **result timezone**. You can look up timezones here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones `)
					.catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(`Please specify a result timezone for your convert command.`)
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(`Please use the tz database format for the **starting timezone**. You can look up timezones here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones `)
			.catch(console.error);
	}
}

module.exports = command;
