const Command = require('./../Classes/Command.js');
const { DateTime, IANAZone, LocalZone } = require("luxon");
var chrono = require('chrono-node');

var convert = new Command();
convert.names = ["convert"];
convert.summary = `Convert a time to someone else's time zone or a given time zone`;
convert.managerCommand = false;

convert.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command calculates a time for a given user. ${clientUser} uses IANA specified timezones.
Syntax: ${clientUser} \`${state.messageArray[0]} (time) in (starting timezone) for (user)\`

The command can also be used to switch a time to a given timezone.
Syntax: ${clientUser} \`${state.messageArray[0]} (time) in (starting timezone) to (resulting timezone)\`

If you omit the starting timezone, the bot will assume you mean the timezone you've recorded for the \"timezone\" platform.`;
}

convert.execute = (receivedMessage, state, metrics) => {
    // Calculates the time for a user or time zone, given an inital time zone
    let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);
    var timeText = "";
    var startTimezone = "";
    var resultTimezone;

    if (mentionedGuildMembers.length == 1) {
        let targetGuildMember = mentionedGuildMembers[0];
        if (Object.keys(state.cachedGuild.platformsList).includes("timezone")) {
            if (targetGuildMember) {
                if (state.cachedGuild.userDictionary[targetGuildMember.id] && state.cachedGuild.userDictionary[targetGuildMember.id].timezone) {
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
                    resultTimezone = state.cachedGuild.userDictionary[targetGuildMember.id].timezone.value;
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
        if (state.cachedGuild.userDictionary[receivedMessage.author.id].timezone.value) {
            startTimezone = state.cachedGuild.userDictionary[receivedMessage.author.id].timezone.value;
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
                receivedMessage.author.send(`Please use the IANA timezone format for the **result timezone**. You can look up timezones here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones `)
                    .catch(console.error);
            }
        } else {
            // Error Message
            receivedMessage.author.send(`Please specify a result timezone for your convert command.`)
                .catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please use the IANA timezone format for the **starting timezone**. You can look up timezones here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones `)
            .catch(console.error);
    }
}

module.exports = convert;
