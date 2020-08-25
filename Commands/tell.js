const Command = require('./../Classes/Command.js');
const { MessageMentions } = require('discord.js');
const { millisecondsToHours } = require('./../helpers.js');

var command = new Command(["tell", "send"], `Have DirectoryBot send someone your information`, false, false, false)
    .addDescription(`This command sends your information on the given platform to the given user.`)
    .addSection(`Tell someone your data`, `\`@DirectoryBot tell (platform) (user)\``);

command.execute = (receivedMessage, state, metrics) => {
    // Sends the user's given information to another user, which later expires
    let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);

    if (mentionedGuildMembers.length >= 1) {
        let nonMentions = state.messageArray.filter(word => !word.match(MessageMentions.USERS_PATTERN));
        if (nonMentions.length > 0) {
            var platform = nonMentions[0].toLowerCase();
            if (Object.keys(state.platformsList).includes(platform)) {
                if (state.userDictionary[receivedMessage.author.id] && state.userDictionary[receivedMessage.author.id][platform].value) {
                    var senderInfo = `${receivedMessage.author.username} from ${receivedMessage.guild} has sent you ${state.userDictionary[receivedMessage.author.id].possessivepronoun && state.userDictionary[receivedMessage.author.id]["possessivepronoun"].value ? state.userDictionary[receivedMessage.author.id].possessivepronoun.value : 'their'} ${platform} ${state.platformsList[platform].term}`;

                    mentionedGuildMembers.forEach(recipient => {
                        if (!recipient.bot) {
                            recipient.send(senderInfo + `. It is:\n\t${state.userDictionary[receivedMessage.author.id][platform].value}

This message will expire in about ${millisecondsToHours(state.infoLifetime)}.`).then(sentMessage => {
                                sentMessage.setToExpire(state, receivedMessage.guild.id, senderInfo + `, but it has expired. You can look it up again with ${receivedMessage.client.user}\` lookup \`${receivedMessage.author}\` ${platform}\`.`);
                            }).catch(console.error);
                        }
                    })
                    receivedMessage.author.send(`Your ${platform} ${state.platformsList[platform].term} has been sent to ${mentionedGuildMembers.toString()}.`)
                        .catch(console.error);
                } else {
                    // Error Message
                    receivedMessage.author.send(`You have not recorded a ${platform} ${state.platformsList[platform].term} in ${receivedMessage.guild}.`)
                        .catch(console.error);
                }
            } else {
                // Error Message
                receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`)
                    .catch(console.error);
            }
        } else {
            // Error Message
            receivedMessage.author.send(`Please provide the platform of the information to send.`)
                .catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please mention someone in ${receivedMessage.guild} to send your information to.`)
            .catch(console.error);
    }
}

module.exports = command;
