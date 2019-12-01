exports.millisecondsToHours = function (milliseconds, showMinutes = false, showSeconds = false) {
    var text = "less than an hour";
    if (milliseconds >= 3600000) {
        text = `${Math.floor(milliseconds / 3600000)} hour(s)`;
    }

    if (showMinutes && Math.floor(milliseconds % 3600000 / 60000) > 0) {
        if (text == "less than an hour") {
            text = `${Math.floor(milliseconds % 3600000 / 60000)} minute(s)`;
        } else {
            text += ` and ${Math.floor(milliseconds % 3600000 / 60000)} minute(s)`;
        }
    }

    if (showSeconds && Math.floor(milliseconds % 60000 / 1000) > 0) {
        if (text == "less than an hour") {
            text = `${Math.floor(milliseconds % 60000 / 1000)} seconds(s)`;
        } else {
            text += ` and ${Math.floor(milliseconds % 60000 / 1000)} seconds(s)`;
        }
    }

    return text;
}