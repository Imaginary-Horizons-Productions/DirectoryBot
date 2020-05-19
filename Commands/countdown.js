const Command = require('./../Classes/Command.js');
const { DateTime, IANAZone, LocalZone } = require("luxon");
var chrono = require('chrono-node');
const { millisecondsToHours } = require('./../helpers.js');

var command = new Command();
command.names = ["countdown"];
command.summary = `How long until the given time`;
command.managerCommand = false;

command.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command states the time until the given time. ${clientUser} uses IANA specified timezones. If no timezone is given ${client.user} will try with the user's timezone default, then the server's local timezone failing that.\n\
Syntax: ${clientUser} \`${state.messageArray[0]} (time) in (timezone)\``;
}

command.execute = (receivedMessage, state, metrics) => {
    // Calculates the amount of time until the given date
    var startTimezone = LocalZone.instance.name;
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
        if (state.cachedGuild.userDictionary[receivedMessage.author.id].timezone) {
            if (!IANAZone.isValidZone(startTimezone) && state.cachedGuild.userDictionary[receivedMessage.author.id] && state.cachedGuild.userDictionary[receivedMessage.author.id].timezone.value) {
                startTimezone = state.cachedGuild.userDictionary[receivedMessage.author.id].timezone.value;
            }
        } else {
            // Error Message
            receivedMessage.author.send(`Please specify a time zone for the time to count down to.`);
            return;
        }
        if (IANAZone.isValidZone(startTimezone)) {
            inputTime[0].start.assign("timezoneOffset", IANAZone.create(startTimezone).offset(Date.now()));
            var dateTimeObject = DateTime.fromJSDate(inputTime[0].start.date());
            var duration = dateTimeObject.diffNow("milliseconds").normalize();
            if (duration.milliseconds < 0) {
                duration = duration.plus(86400000); // 86400000 is a day in milliseconds
                duration.normalize();
            }
            receivedMessage.author.send(`*${state.messageArray[0]} in ${startTimezone}* is about **${millisecondsToHours(duration.milliseconds, true)}** from now.`);
        } else {
            // Error message
            receivedMessage.author.send(`The time zone you entered could not be parsed.`).catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`The time you provided could not be parsed (Remember to specify AM or PM).`);
    }
}

module.exports = command;
