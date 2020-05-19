const Command = require('./../Classes/Command.js');

var command = new Command();
command.names = ["shoutout", "streamshoutout"];
command.summary = `Have DirectoryBot post someone's stream information`;
command.managerCommand = false;

command.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command posts the given user's stream information.\n\
Syntax: ${clientUser} \`${state.messageArray[0]} (user)\``;
}

command.execute = (receivedMessage, state, metrics) => {
	// Posts the link to a user's recorded stream, currently supported: twitch
    if (Object.keys(state.cachedGuild.platformsList).includes("stream")) {
        let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);
        if (mentionedGuildMembers[0]) {
            var user = mentionedGuildMembers[0];

            if (state.cachedGuild.userDictionary[user.id] && state.cachedGuild.userDictionary[user.id].stream.value) {
                var url = "https://www.twitch.tv/" + state.cachedGuild.userDictionary[user.id].stream.value;

                receivedMessage.channel.send(`Check out ${user}'s stream at ${url} !`)
            } else {
                // Error Message
                receivedMessage.channel.send(`${user} has not set a stream username in this server's DirectoryBot yet.`);
            }
        } else {
            // Error Message
            receivedMessage.author.send(`That person isn't a member of ${receivedMessage.guild}.`);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Your \`shoutout\` command could not be completed. ${receivedMessage.guild} does not seem to be tracking stream information.`);
    }
}

module.exports = command;
