const Command = require('./../Classes/Command.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { syncUserRolePlatform, saveUserDictionary } = require('./../helpers.js');

var command = new Command();
command.names = ["delete", "remove", "clear"];
command.summary = `Remove your information for a platform`;
command.managerCommand = false;

command.help = (clientUser, state) => { // function for constructing examples with used overloads
    return `The *${state.messageArray[0]}* command removes your information for the given platform.\n\
Syntax: ${clientUser} \`${state.messageArray[0]} (platform)\`${state.botManager ? `Bot Managers can use the *${state.messageArray[0]}* command to remove information for other users.\n\
Syntax: ${clientUser} \`${state.messageArray[0]} (user) (platform)\`` : ``}`;
}

command.execute = (receivedMessage, state, metrics) => {
    // Command specifications go here
    if (state.messageArray.length > 0) {
        let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);
        var platform = state.messageArray[0].toLowerCase();
        var msgList = state.messageArray.slice(1);
        var reason = msgList.join(" ");

        if (Object.keys(state.cachedGuild.platformsList).includes(platform)) {
            if (mentionedGuildMembers.length == 1) {
                if (mentionedGuildMembers[0]) {
                    if (state.botManager) {
                        var target = mentionedGuildMembers[0];

                        if (state.cachedGuild.userDictionary[target.id] && state.cachedGuild.userDictionary[target.id][platform].value) {
                            state.cachedGuild.userDictionary[target.id][platform] = new FriendCode();
                            target.send(`Your ${platform} ${state.cachedGuild.platformsList[platform].term} has been removed from ${receivedMessage.guild}${reason ? ` because ${reason}` : ""}.`);
                            syncUserRolePlatform(target, platform, state.cachedGuild);
                            saveUserDictionary(receivedMessage.guild.id, state.cachedGuild.userDictionary);
                            receivedMessage.author.send(`You have removed ${target}'s ${platform} ${state.cachedGuild.platformsList[platform].term} from ${receivedMessage.guild}.`);
                        } else {
                            // Error Message
                            receivedMessage.author.send(`${target} does not have a ${platform} ${state.cachedGuild.platformsList[platform].term} recorded in ${receivedMessage.guild}.`);
                        }
                    } else {
                        // Error Message
                        receivedMessage.author.send(`You need a role with administrator privileges${state.cachedGuild.managerRoleID ? ` or the role @${receivedMessage.guild.roles.resolve(cachedGuild.managerRoleID).name}` : ""} to remove ${state.cachedGuild.platformsList[platform].term}s for others.`).catch(console.error);
                    }
                } else {
                    // Error Message
                    receivedMessage.author.send(`That person isn't a member of ${receivedMessage.guild}.`).catch(console.error);
                }
            } else {
                if (state.cachedGuild.userDictionary[receivedMessage.author.id] && state.cachedGuild.userDictionary[receivedMessage.author.id][platform].value) {
                    state.cachedGuild.userDictionary[receivedMessage.author.id][platform] = new FriendCode();
                    receivedMessage.author.send(`You have removed your ${platform} ${state.cachedGuild.platformsList[platform].term} from ${receivedMessage.guild}.`).catch(console.error);
                    syncUserRolePlatform(receivedMessage.member, platform, state.cachedGuild);
                    saveUserDictionary(receivedMessage.guild.id);
                } else {
                    // Error Message
                    receivedMessage.author.send(`You do not currently have a ${platform} ${state.cachedGuild.platformsList[platform].term} recorded in ${receivedMessage.guild}.`).catch(console.error);
                }
            }
        } else {
            // Error Message
            receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`).catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please provide the platform of the information to delete.`)
    }
}

module.exports = command;
