const Command = require('./../Classes/Command.js');

var command = new Command(['mydata', 'myentries'], `Lists all your platform entries`, false, false, false)
    .addDescription(`This command sends you a private message with all the information you've recorded.`)
    .addSection(`Usage`, `\`@DirectoryBot mydata\``);

command.execute = (receivedMessage, state, metrics) => {
    // Sends the user all the information they've input into the bot
    let text = `Your entries in ${receivedMessage.guild} are:`;
    let dictionary = state.cachedGuild.userDictionary[receivedMessage.author.id];
    Object.keys(dictionary).forEach(platform => {
        if (dictionary[platform].value) {
            text += '\n' + platform + ': ' + dictionary[platform].value;
        }
    })

    if (text.length < 2001) {
        receivedMessage.author.send(text)
            .catch(console.error);
    } else {
        // Error Message
        receivedMessage.author.send(`Your \`myentries\` message is too long to fit in a single Discord message. Please try the \`lookup\` command instead.`)
            .catch(console.error);
    }
}

module.exports = command;
