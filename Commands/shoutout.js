const Command = require('./../Classes/Command.js');

var command = new Command(["shoutout", "streamshoutout"], `Have DirectoryBot post someone's stream information`, false, false, false)
    .addDescription(`This command posts the given user's stream information.`)
    .addSection(`Give a stream shoutout`, `\`@DirectoryBot shoutout (user)\``);

command.execute = (receivedMessage, state, metrics) => {
	// Posts the link to a user's recorded stream, currently supported: twitch
    if (Object.keys(state.cachedGuild.platformsList).includes("stream")) {
        let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);
        if (mentionedGuildMembers[0]) {
            var user = mentionedGuildMembers[0];

            if (state.cachedGuild.userDictionary[user.id] && state.cachedGuild.userDictionary[user.id].stream.value) {
                var url = "https://www.twitch.tv/" + state.cachedGuild.userDictionary[user.id].stream.value;

                receivedMessage.channel.send(`Check out ${user}'s stream at ${url} !`)
                    .catch(console.error);
            } else {
                // Error Message
                receivedMessage.channel.send(`${user} has not set a stream username in this server's DirectoryBot yet.`)
                    .catch(console.error);
            }
        } else {
            // Error Message
            receivedMessage.author.send(`That person isn't a member of ${receivedMessage.guild}.`)
                .catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Your \`shoutout\` command could not be completed. ${receivedMessage.guild} does not seem to be tracking stream information.`)
            .catch(console.error);
    }
}

module.exports = command;
