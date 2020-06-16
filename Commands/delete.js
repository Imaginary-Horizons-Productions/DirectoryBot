const Command = require('./../Classes/Command.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { saveUserDictionary } = require('./../helpers.js');
const { MessageMentions } = require('discord.js');

var remove = new Command();
remove.names = ["delete", "remove", "clear"];
remove.summary = `Remove your information for a platform`;
remove.managerCommand = false;

remove.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command removes your information for the given platform.
Syntax: ${clientUser} \`${state.messageArray[0]} (platform)\`\
${state.botManager ? `\n\nBot Managers can use the *${state.messageArray[0]}* command to remove information for other users.
Syntax: ${clientUser} \`${state.messageArray[0]} (user) (platform)\`` : ``}`;
}

remove.execute = (receivedMessage, state, metrics) => {
    // Removes the user's entry for the given platform, bot managers can remove for other users
    if (state.messageArray.length > 0) {
        let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);
        var platform = state.messageArray.filter(word => !word.match(MessageMentions.USERS_PATTERN))[0].toLowerCase();
        var msgList = state.messageArray.slice(1);
        var reason = msgList.join(" ");

        if (Object.keys(state.cachedGuild.platformsList).includes(platform)) {
            if (mentionedGuildMembers.length == 1) {
                if (mentionedGuildMembers[0]) {
                    if (state.botManager) {
                        var target = mentionedGuildMembers[0];

                        if (state.cachedGuild.userDictionary[target.id] && state.cachedGuild.userDictionary[target.id][platform].value) {
                            state.cachedGuild.userDictionary[target.id][platform] = new FriendCode();
                            target.send(`Your ${platform} ${state.cachedGuild.platformsList[platform].term} has been removed from ${receivedMessage.guild}${reason ? ` because ${reason}` : ""}.`)
                                .catch(console.error);
                            target.roles.remove(state.cachedGuild.platformsList[platform].roleID);
                            saveUserDictionary(receivedMessage.guild.id, state.cachedGuild.userDictionary);
                            receivedMessage.author.send(`You have removed ${target}'s ${platform} ${state.cachedGuild.platformsList[platform].term} from ${receivedMessage.guild}.`)
                                .catch(console.error);
                        } else {
                            // Error Message
                            receivedMessage.author.send(`${target} does not have a ${platform} ${state.cachedGuild.platformsList[platform].term} recorded in ${receivedMessage.guild}.`)
                                .catch(console.error);
                        }
                    } else {
                        // Error Message
                        receivedMessage.author.send(`You need a role with administrator privileges${state.cachedGuild.managerRoleID ? ` or the role @${receivedMessage.guild.roles.resolve(cachedGuild.managerRoleID).name}` : ""} to remove ${state.cachedGuild.platformsList[platform].term}s for others.`)
                            .catch(console.error);
                    }
                } else {
                    // Error Message
                    receivedMessage.author.send(`That person isn't a member of ${receivedMessage.guild}.`)
                        .catch(console.error);
                }
            } else {
                if (state.cachedGuild.userDictionary[receivedMessage.author.id][platform] && state.cachedGuild.userDictionary[receivedMessage.author.id][platform].value) {
                    state.cachedGuild.userDictionary[receivedMessage.author.id][platform] = new FriendCode();
                    receivedMessage.author.send(`You have removed your ${platform} ${state.cachedGuild.platformsList[platform].term} from ${receivedMessage.guild}.`)
                        .catch(console.error);
                    receivedMessage.member.roles.remove(state.cachedGuild.platformsList[platform].roleID);
                    saveUserDictionary(receivedMessage.guild.id);
                } else {
                    // Error Message
                    receivedMessage.author.send(`You do not currently have a ${platform} ${state.cachedGuild.platformsList[platform].term} recorded in ${receivedMessage.guild}.`)
                        .catch(console.error);
                }
            }
        } else {
            // Error Message
            receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`)
                .catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please provide the platform of the information to delete.`)
            .catch(console.error);
    }
}

module.exports = remove;
