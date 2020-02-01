exports.multistreamCommand = function (arguments, receivedMessage, userDictionary) {
    var url = "https://multistre.am/";
    var layout = arguments["words"][0];

    var missingUsers = [];
    for (var i = 0; i < arguments["userMentions"].length; i++) {
        if (arguments["userMentions"][i]) {
            if (!userDictionary[arguments["userMentions"][i].id] || !userDictionary[arguments["userMentions"][i].id]["stream"].value) {
                missingUsers.push(arguments["userMentions"][i].user);
            } else {
                url += userDictionary[arguments["userMentions"][i].id]["stream"].value + "/";
            }
        } else {
            // Error Message
            receivedMessage.author.send(`One of those people is not a member of ${receivedMessage.guild}.`);
            return;
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
    if (arguments["userMentions"][0]) {
        var user = arguments["userMentions"][0];

        if (userDictionary[user.id] && userDictionary[user.id]["stream"].value) {
            var url = "https://www.twitch.tv/" + userDictionary[user.id]["stream"].value;

            receivedMessage.channel.send(`Check out ${user}'s stream at ${url} !`)
        } else {
            // Error Message
            receivedMessage.channel.send(`${user} has not set a stream username in this server's DirectoryBot yet.`);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`That person isn't a member of ${receivedMessage.guild}.`);
    }
}

//TODO going live notification
//TODO weekly stream schedule updates
