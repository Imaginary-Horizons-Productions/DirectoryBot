exports.multistreamCommand = function (arguments, receivedMessage, userDictionary) {
    var url = "https://multistre.am/";
    var layout = arguments["words"][1];

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

    receivedMessage.channel.send(`Here's the multistream link: ${url}`);
}

//TODO going live notification
//TODO weekly stream schedule updates
