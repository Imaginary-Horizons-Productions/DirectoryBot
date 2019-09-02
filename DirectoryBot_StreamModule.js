exports.multistreamCommand = function (arguments, receivedMessage, userDictionary) {
    var url = "https://multistre.am/";
    var layout = arguments["words"][0];

    var missingUsers = [];
    for (var i = 0; i < arguments["userMentions"].length; i++) {
        if (!userDictionary[arguments["userMentions"][i].id] || !userDictionary[arguments["userMentions"][i].id]["twitch"].value) {
            missingUsers.push(arguments["userMentions"][i].user);
        } else {
            url += userDictionary[arguments["userMentions"][i].id]["twitch"].value + "/";
        }
    }

    if (missingUsers.length > 0) {
        let missingUsersText = "";
        for (var i = 0; i < missingUsers.length; i++) {
            missingUsersText += missingUsers[i] + ", ";
        }

        missingUsersText = missingUsersText.slice(0, -2);
        // Error Message
        receivedMessage.channel.send(`The following users don't have stream info logged with DirectoryBot: ${missingUsersText}.`)
        return;
    }

    if (layout) {
        if (/^[0-9]+$/.test(layout)) {
            url += "layout" + layout;
        } else {
            // Error Message (non-halting)
            receivedMessage.author.send(`The multistream layout argument you sent (${layout}) was not a number.`);
        }
    }

    receivedMessage.author.send(`Here's the multistream link: ${url}`);
}

exports.streamShoutoutCommand = function (arguments, receivedMessage, userDictionary) {
    var user = arguments["userMentions"][0];

    if (userDictionary[user.id] && userDictionary[user.id]["twitch"].value) {
        var url = "https://www.twitch.tv/" + userDictionary[user.id]["twitch"].value;

        receivedMessage.channel.send(`Check out ${user}'s stream at ${url} !`)
    } else {
        // Error Message
        receivedMessage.channel.send(`${user} has not set a twitch username in this server's DirectoryBot yet.`);
    }
}

//TODO going live notification
//TODO weekly stream schedule updates
