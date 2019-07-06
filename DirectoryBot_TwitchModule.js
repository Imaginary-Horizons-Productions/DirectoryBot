exports.multistreamCommand = function (arguments, receivedMessage, userDictionary) {
    var url = "https://multistre.am/";
    var layout = arguments["words"][1];

    for (var i = 0; i < arguments["userMentions"].length; i++) {
        if (!userDictionary[arguments["userMentions"][i].id] || !userDictionary[arguments["userMentions"][i].id]["twitch"].value) {
            receivedMessage.channel.send(`${arguments["userMentions"][i]} does not have a Twitch account logged with **DirectoryBot**.`)
            return;
        }
        url += userDictionary[arguments["userMentions"][i].id]["twitch"].value + "/";
    }
    if (layout) {
        url += "layout" + layout;
    }

    receivedMessage.channel.send(`Here's the multistream link: ${url}`);
}