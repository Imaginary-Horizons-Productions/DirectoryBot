const { DateTime, IANAZone } = require("luxon");
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
        resultTimezone = userDictionary[arguments["userMentions"][0].id]["timezone"];
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
            receivedMessage.author.send(`Please either specifiy a starting timezone or record your default with \`@DirectoryBot record timezone (timezone)\`.`);
            return;
        }
    }
    timeText += "(" + startTimezone + ")";

    if (IANAZone.isValidZone(startTimezone)) {
        if (IANAZone.isValidZone(resultTimezone)) {
            var inputTime = new chrono.parse(timeText);
            var dateTimeObject = DateTime.fromJSDate(inputTime[0].start.date());
            var convertedDateTime = dateTimeObject.setZone(resultTimezone);

            if (arguments["userMentions"].length == 1) {
                receivedMessage.channel.send(`${arguments["words"][1]} in ${startTimezone} is ${convertedDateTime.toLocaleString(DateTime.TIME_SIMPLE)} for ${arguments["userMentions"][0]}.`);
            } else {
                receivedMessage.channel.send(`${arguments["words"][1]} in ${startTimezone} is ${convertedDateTime.toLocaleString(DateTime.TIME_SIMPLE)} in ${resultTimezone}.`);
            }
        } else {
            receivedMessage.author.send(`Please use the IANA timezone format for the result timezone. You can look up timezones here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones`);
        }
    } else {
        receivedMessage.author.send(`Please use the IANA timezone format for the starting timezone. You can look up timezones here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones`);
    }
}


exports.countdownCommand = function (arguments, receivedMessage) {
    var timeText = "";
    for (var i = 0; i < arguments["words"].length; i++) {
        if (arguments["words"][i] != "countdown") {
            timeText += arguments["words"][i] + " ";
        }
    }

    var inputTime = new chrono.parse(timeText); //BUG chrono doesn't parse IANA
    var dateTimeObject = DateTime.fromJSDate(inputTime[0].start.date());
    var countdown = dateTimeObject.diffNow("minutes").toString();
    countdown = countdown.replace(/[a-zA-Z]/g, '');
    countdown = parseInt(countdown);

    receivedMessage.channel.send(`${arguments["words"][1]} is about ${countdown} minutes from now.`);
}