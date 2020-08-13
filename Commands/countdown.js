const Command = require('./../Classes/Command.js');
const { DateTime, IANAZone, LocalZone } = require("luxon");
var chrono = require('chrono-node');
const { millisecondsToHours } = require('./../helpers.js');

var countdown = new Command();
countdown.names = ["countdown"];
countdown.summary = `How long until the given time`;
countdown.managerCommand = false;

countdown.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command states the time until the given time. ${clientUser} uses IANA specified timezones. If no timezone is given ${client.user} will try with the user's timezone default, then the server's local timezone failing that.
Syntax: ${clientUser} \`${state.messageArray[0]} (time) in (timezone)\``;
}

countdown.execute = (receivedMessage, state, metrics) => {
    // Calculates the amount of time until the given date
    var startTimezone = "";
    var timeText = "";
    for (var i = 0; i < state.messageArray.length; i++) {
        if (state.messageArray[i] == "in") {
            startTimezone = state.messageArray[i + 1]
            i++;
        } else if (state.messageArray[i] != "countdown") {
            timeText += state.messageArray[i] + " ";
        }
    }

    var inputTime = new chrono.parse(timeText);
    if (inputTime.length > 0) {
        if (startTimezone == "") {
            if (state.cachedGuild.userDictionary[receivedMessage.author.id].timezone.value) {
                startTimezone = state.cachedGuild.userDictionary[receivedMessage.author.id].timezone.value;
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
            receivedMessage.author.send(`*${state.messageArray[0]} in ${startTimezone}* is about **${millisecondsToHours(duration.milliseconds, true)}** from now.`)
                .catch(console.error);
        } else {
            // Error message
            receivedMessage.author.send(`The time zone you entered could not be parsed.`)
                .catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`The time you provided could not be parsed (remember to specify AM or PM).`)
            .catch(console.error);
    }
}

module.exports = countdown;
