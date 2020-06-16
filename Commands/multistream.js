const Command = require('./../Classes/Command.js');

var multistream = new Command();
multistream.names = ["multistream", "multitwitch"];
multistream.summary = `Generate a multistream link for the given users`;
multistream.managerCommand = false;

multistream.help = (clientUser, state) => { // function for constructing examples with used overloads
    return `The *${state.messageArray[0]}* command generates a link to watch multiple streams simultaneously. Optionally, you can enter the layout number last if you want to specify that.
Syntax: ${clientUser} \`${state.messageArray[0]} (user1) (user2)... (layout)\``;
}

multistream.execute = (receivedMessage, state, metrics) => {
    // Generates a url for viewing multiple streams simultaneously (Supported: Twitch)
    if (Object.keys(state.cachedGuild.platformsList).includes("stream")) {
        var url = "https://multistre.am/";
        let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);

        if (mentionedGuildMembers.length > 1) {
            let returnText = "";
            var missingUsers = [];
            for (var i = 0; i < mentionedGuildMembers.length; i++) {
                if (mentionedGuildMembers[i] && state.cachedGuild.userDictionary[mentionedGuildMembers[i].id] && state.cachedGuild.userDictionary[mentionedGuildMembers[i].id].stream.value) {
                    url += state.cachedGuild.userDictionary[mentionedGuildMembers[i].id].stream.value + "/";
                } else {
                    missingUsers.push(mentionedGuildMembers[i].user);
                }
            }

            for (var i = 0; i < state.messageArray.length; i++) {
                if (!isNaN(parseInt(state.messageArray[i]))) {
                    url += "layout" + state.messageArray[i];
                    break;
                }
            }

            if (missingUsers.length < mentionedGuildMembers.length) {
                returnText += `Here's the multistream link: ${url}`;
            }

            if (missingUsers.length > 0) {
                returnText += `\n\nThe following users don't have stream info logged with DirectoryBot: ${missingUsers.join(", ")}.`;
            }

            receivedMessage.author.send(returnText)
                .catch(console.error);
        } else {
            // Error Message
            receivedMessage.author.send(`Please mention at least two users to generate a multistream link for.`)
                .catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Your multistream command could not be completed. ${receivedMessage.guild} does not seem to be tracking stream information.`)
            .catch(console.error);
    }
}

module.exports = multistream;
