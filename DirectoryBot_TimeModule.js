const { DateTime, IANAZone, LocalZone } = require("luxon");
var chrono = require('chrono-node');
var helpers = require('./DirectoryBot_Helpers.js');

exports.convertCommand = function (arguments, receivedMessage, userDictionary, shortcut = false) {
    var timeText = "";
    var startTimezone = "";
    var resultTimezone;

    if (shortcut) {
        timeText += arguments["command"] + " ";
    }

    if (arguments["guildMemberMentions"].length == 1) {
        if (arguments["guildMemberMentions"][0]) {
            for (var i = 0; i < arguments["words"].length; i++) {
                if (arguments["words"][i] == "in") {
                    startTimezone = arguments["words"][i + 1]
                    i++;
                } else if (arguments["words"][i] == "for") {
                    break;
                } else {
                    timeText += arguments["words"][i] + " ";
                }
            }
            resultTimezone = userDictionary[arguments["guildMemberMentions"][0].id]["timezone"].value;
        } else {
            // Error Message
            receivedMessage.author.send(`That person isn't a member of ${receivedMessage.guild}.`);
            return;
        }
    } else {
        for (var i = 0; i < arguments["words"].length; i++) {
            if (arguments["words"][i] == "in") {
                startTimezone = arguments["words"][i + 1]
                i++;
            } else if (arguments["words"][i] == "to") {
                resultTimezone = arguments["words"][i + 1];
                break;
            } else {
                timeText += arguments["words"][i] + " ";
            }
        }
    }
    if (startTimezone == "") {
        if (userDictionary[receivedMessage.author.id] && userDictionary[receivedMessage.author.id]["timezone"].value) {
            startTimezone = userDictionary[receivedMessage.author.id]["timezone"].value;
        } else {
            // Error Message
            receivedMessage.author.send(`Please either specifiy a starting timezone or record your default with \`@DirectoryBot record timezone (timezone)\`.\n\
\n\
You sent: ${receivedMessage}`);
            return;
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

                    if (arguments["guildMemberMentions"].length == 1) {
                        if (shortcut) {
                            receivedMessage.channel.send(`*${timeText}in ${startTimezone}* is **${convertedDateTime.toLocaleString(DateTime.TIME_24_SIMPLE)}** for ${arguments["guildMemberMentions"][0]}.`);
                        } else {
                            receivedMessage.author.send(`*${timeText}in ${startTimezone}* is **${convertedDateTime.toLocaleString(DateTime.TIME_24_SIMPLE)}** for ${arguments["guildMemberMentions"][0]}.`);
                        }
                    } else {
                        if (shortcut) {
                            receivedMessage.channel.send(`*${timeText}in ${startTimezone}* is **${convertedDateTime.toLocaleString(DateTime.TIME_24_SIMPLE)} in ${resultTimezone}**.`);
                        } else {
                            receivedMessage.author.send(`*${timeText}in ${startTimezone}* is **${convertedDateTime.toLocaleString(DateTime.TIME_24_SIMPLE)} in ${resultTimezone}**.`);
                        }
                    }
                } else {
                    // Error Message
                    receivedMessage.author.send(`The time you provided could not be parsed. (Remember to specify AM or PM.)\n\n\
You sent: ${receivedMessage}`);
                }
            } else {
                // Error Message
                receivedMessage.author.send(`Please use the IANA timezone format for the **result timezone**. You can look up timezones here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones \n\n\
You sent: ${receivedMessage}`);
            }
        } else {
            // Error Message
            receivedMessage.author.send(`Please specify a result timezone for your convert command.\n\
You sent: ${receivedMessage}`);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please use the IANA timezone format for the **starting timezone**. You can look up timezones here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones \n\n\
You sent: ${receivedMessage}`);
    }
}


exports.countdownCommand = function (arguments, receivedMessage, userDictionary) {
    var startTimezone = LocalZone.instance.name;
    var timeText = "";
    for (var i = 0; i < arguments["words"].length; i++) {
        if (arguments["words"][i] == "in") {
            startTimezone = arguments["words"][i + 1]
            i++;
        } else if (arguments["words"][i] != "countdown") {
            timeText += arguments["words"][i] + " ";
        }
    }


    var inputTime = new chrono.parse(timeText);
    if (inputTime.length > 0) {
        if (!IANAZone.isValidZone(startTimezone) && userDictionary[receivedMessage.author.id] && userDictionary[receivedMessage.author.id]["timezone"].value) {
            startTimezone = userDictionary[receivedMessage.author.id]["timezone"].value;
        }
        inputTime[0].start.assign("timezoneOffset", IANAZone.create(startTimezone).offset(Date.now()));
        var dateTimeObject = DateTime.fromJSDate(inputTime[0].start.date());
        var duration = dateTimeObject.diffNow("milliseconds").normalize();
        if (duration.milliseconds < 0) {
            duration = duration.plus(86400000); // 86400000 is a day in milliseconds
            duration.normalize();
            console.log(duration);
        }
        receivedMessage.author.send(`*${arguments["words"][0]} in ${startTimezone}* is about **${helpers.millisecondsToHours(duration.milliseconds, true)}** from now.`);
    } else {
        // Error Message
        receivedMessage.author.send(`The time you provided could not be parsed. (Remember to specify AM or PM.)\n\n\
You sent: ${receivedMessage}`);
    }
}