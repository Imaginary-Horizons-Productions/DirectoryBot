const Command = require('./../Classes/Command.js');

var whois = new Command();
whois.names = ["whois"];
whois.summary = `Ask DirectoryBot who a certain username belongs to`;
whois.managerCommand = false;

whois.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command checks if anyone uses the given username and private messages you the result.
Syntax: ${clientUser} \`${state.messageArray[0]} (username)\``;
}

whois.execute = (receivedMessage, state, metrics) => {
    // Finds the platform and user associated with a given username
    if (state.messageArray.length > 0) {
        var searchTerm = state.messageArray[0];
        var reply = `The following people have recorded ${searchTerm} in ${receivedMessage.guild.name}:`;
        Object.keys(state.cachedGuild.userDictionary).forEach(userID => {
            for (var platform in state.cachedGuild.userDictionary[userID]) {
                if (state.cachedGuild.userDictionary[userID][platform].value == searchTerm) {
                    reply += `\n${receivedMessage.guild.members.resolve(userID).displayName} for ${platform}`;
                }
            }
        })

        receivedMessage.author.send(reply)
            .catch(console.error);
    } else {
        // Error Message
        receivedMessage.author.send(`Please specify a username to check for.`)
            .catch(console.error);
    }
}

module.exports = whois;
