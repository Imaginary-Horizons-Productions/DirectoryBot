const { DateTime, IANAZone, LocalZone } = require("luxon");
var chrono = require('chrono-node');

exports.convertCommand = function (arguments, receivedMessage, userDictionary) {
    var timeText = "";
    var startTimezone = "";
    var resultTimezone;

    //TODO check against convertOverloads here to adjust argument indexing after shortcut has been implemented

    if (arguments["userMentions"].length == 1) {
        for (var i = 0; i < arguments["words"].length; i++) {
            if (arguments["words"][i] == "in") {
                startTimezone = arguments["words"][i + 1]
                i++;
            } else if (arguments["words"][i] == "for") {
                break;
            } else if (arguments["words"][i] != "convert") {
                timeText += arguments["words"][i] + " ";
            }
        }
        resultTimezone = userDictionary[arguments["userMentions"][0].id]["timezone"].value;
    } else {
        for (var i = 0; i < arguments["words"].length; i++) {
            if (arguments["words"][i] == "in") {
                startTimezone = arguments["words"][i + 1]
                i++;
            } else if (arguments["words"][i] == "to") {
                resultTimezone = arguments["words"][i + 1];
                break;
            } else if (arguments["words"][i] != "convert") {
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
                inputTime[0].start.assign("timezoneOffset", IANAZone.create(startTimezone).offset(Date.now()));
                var dateTimeObject = DateTime.fromJSDate(inputTime[0].start.date(), { zone: startTimezone });
                var convertedDateTime = dateTimeObject.setZone(resultTimezone);

                if (arguments["userMentions"].length == 1) {
                    receivedMessage.author.send(`*${arguments["words"][0]} in ${startTimezone}* is **${convertedDateTime.toLocaleString(DateTime.TIME_24_SIMPLE)}** for ${arguments["userMentions"][0]}.`);
                } else {
                    receivedMessage.author.send(`*${arguments["words"][0]} in ${startTimezone}* is **${convertedDateTime.toLocaleString(DateTime.TIME_24_SIMPLE)} in ${resultTimezone}**.`);
                }
            } else {
                // Error Message
                receivedMessage.author.send(`Please use the IANA timezone format for the **result timezone**. You can look up timezones here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones\n\
\n\
You sent: ${receivedMessage}`);
            }
        } else {
            // Error Message
            receivedMessage.author.send(`Please specify a result timezone for your convert command.\n\
You sent: ${receivedMessage}`);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please use the IANA timezone format for the **starting timezone**. You can look up timezones here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones\n\
\n\
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
    if (!IANAZone.isValidZone(startTimezone) && userDictionary[receivedMessage.author.id] && userDictionary[receivedMessage.author.id]["timezone"].value) {
        startTimezone = userDictionary[receivedMessage.author.id]["timezone"].value;
    }
    inputTime[0].start.assign("timezoneOffset", IANAZone.create(startTimezone).offset(Date.now()));
    var dateTimeObject = DateTime.fromJSDate(inputTime[0].start.date());
    var countdown = dateTimeObject.diffNow("minutes").toString();
    countdown = countdown.replace(/[a-zA-Z]/g, '');
    countdown = parseInt(countdown);
    if (countdown < 0) {
        countdown += 1440;
    }

    if (countdown > 60) {
        receivedMessage.author.send(`*${arguments["words"][0]} in ${startTimezone}* is about **${Math.floor(countdown/60)} hours and ${countdown % 60} minutes** from now.`);
    } else {
        receivedMessage.author.send(`*${arguments["words"][0]} in ${startTimezone}* is about **${countdown} minutes** from now.`);
    }
}