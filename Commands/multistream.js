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
        let layout;
        for (var i = 0; i < state.messageArray.length; i++) {
            if (!isNaN(parseInt(state.messageArray[i]))) {
                layout = parseInt(state.messageArray[i]);
                break;
            }
        }
        let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);

        var missingUsers = [];
        for (var i = 0; i < mentionedGuildMembers.length; i++) {
            if (mentionedGuildMembers[i]) {
                if (!state.cachedGuild.userDictionary[mentionedGuildMembers[i].id] || !state.cachedGuild.userDictionary[mentionedGuildMembers[i].id].stream.value) {
                    missingUsers.push(mentionedGuildMembers[i].user);
                } else {
                    url += state.cachedGuild.userDictionary[mentionedGuildMembers[i].id].stream.value + "/";
                }
            } else {
                // Error Message
                receivedMessage.author.send(`One of those people is not a member of ${receivedMessage.guild}.`)
                    .catch(console.error);
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
                .catch(console.error);
            return;
        }

        if (layout) {
            if (/^[0-9]+$/.test(layout)) {
                url += "layout" + layout;
            } else {
                // Error Message (non-halting)
                receivedMessage.author.send(`The multistream layout argument you sent (${layout}) was not a number.`)
                    .catch(console.error);
            }
        }

        receivedMessage.author.send(`Here's the multistream link: ${url}`)
            .catch(console.error);
    } else {
        // Error Message
        receivedMessage.author.send(`Your multistream command could not be completed. ${receivedMessage.guild} does not seem to be tracking stream information.`)
            .catch(console.error);
    }
}

module.exports = multistream;
