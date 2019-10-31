exports.millisecondsToHours = function (milliseconds, showMinutes = false) {
    var text = "less than an hour";
    if (milliseconds >= 3600000) {
        text = `${Math.floor(milliseconds / 3600000)} hour(s)`;
    }

    if (showMinutes && Math.floor(milliseconds % 3600000 / 60000) > 0) {
        if (text != "less than an hour") {
            text += " and ";
        }
        text += `${Math.floor(milliseconds % 3600000 / 60000)} minute(s)`;
    }

    return text;
}