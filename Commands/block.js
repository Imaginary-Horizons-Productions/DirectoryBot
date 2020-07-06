const Command = require('./../Classes/Command.js');
const { saveBlockDictionary } = require('./../helpers.js'); 

var block = new Command();
block.names = ['block'];
block.summary = `Prevents a user from looking up your data`;
block.managerCommand = false;

block.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command prevents the mentioned user from looking up your data.
Syntax: ${clientUser} \`${state.messageArray[0]} (user)\``; 
}

block.execute = (receivedMessage, state, metrics) => {
    // Adds the mentioned user to a list that prevents them from checking the author's data
    let mentionedGuildMember = receivedMessage.mentions.users.array().filter(id => id != receivedMessage.client.user.id);

    if (mentionedGuildMember.length > 0) {
        if (!state.cachedGuild.blockDictionary[receivedMessage.author.id]) {
            state.cachedGuild.blockDictionary[receivedMessage.author.id] = [];
        }

        if (!state.cachedGuild.blockDictionary[receivedMessage.author.id].includes(mentionedGuildMember[0].id)) {
            state.cachedGuild.blockDictionary[receivedMessage.author.id].push(mentionedGuildMember[0].id);
            receivedMessage.author.send(`You have blocked ${mentionedGuildMember[0]} from ${receivedMessage.guild}. They won't be able to look up your information.`)
                .catch(console.error);
        } else {
            state.cachedGuild.blockDictionary[receivedMessage.author.id].splice(state.cachedGuild.blockDictionary[receivedMessage.author.id].indexOf(mentionedGuildMember[0].id), 1);
            receivedMessage.author.send(`You have unblocked ${mentionedGuildMember[0]} from ${receivedMessage.guild}.`)
                .catch(console.error);
        }
        saveBlockDictionary(receivedMessage.guild.id, state.cachedGuild.blockDictionary);
    } else {
        // Error Message
        receivedMessage.author.send(`Please mention a user to block.`)
            .catch(console.error);
    }
}

module.exports = block;
