const Command = require('./../Classes/Command.js');
const { savePlatformsList, syncUserRolePlatform } = require('./../helpers.js');

var setplatformrole = new Command();
setplatformrole.names = ["setplatformrole"];
setplatformrole.summary = `Automatically give a role to users who record information for a platform`;
setplatformrole.managerCommand = true;

setplatformrole.help = (clientUser, state) => {
    return `The *${state.messageArray[0]}* command associates the given role and platform. Anyone who records information for that platform will be automatically given the associated role.
Syntax: ${clientUser} \`${state.messageArray[0]} (platform) (role)\``;
}

setplatformrole.execute = (receivedMessage, state, metrics) => {
    // Sets a role to automatically give to users who set information for the given platform
    if (state.messageArray.length > 0) {
        if (state.messageArray.length > 0) {
            var platform = state.messageArray[0];
            var role = receivedMessage.mentions.roles.array()[0];

            if (state.cachedGuild.platformsList[platform]) {
                if (role) {
                    state.cachedGuild.platformsList[platform].role = role;
                    receivedMessage.channel.send(`Server members who set a ${platform} ${state.cachedGuild.platformsList[platform].term} will now automatically be given the role @${role.name}.`)
                        .catch(console.error);
                } else {
                    state.cachedGuild.platformsList[platform].role = "";
                    receivedMessage.channel.send(`The ${platform} ${state.cachedGuild.platformsList[platform].term} in ${receivedMessage.guild} has been cleared.`)
                        .catch(console.error);
                }
                Object.keys(state.cachedGuild.userDictionary).forEach(userID => {
                    syncUserRolePlatform(receivedMessage.guild.members.resolve(userID), platform, state.cachedGuild);
                })
                savePlatformsList(receivedMessage.guild.id, state.cachedGuild.platformsList);
            } else {
                // Error Message
                receivedMessage.author.send(`${receivedMessage.guild} doesn't have a platform named ${platform}.`)
                    .catch(console.error);
            }
        } else {
            // Error Message
            receivedMessage.author.send(`Please provide a role to set for the platform.`)
                .catch(console.error);
        }
    } else {
        // Error Message
        receivedMessage.author.send(`Please provide a platform to set a role for.`)
            .catch(console.error);
    }
}

module.exports = setplatformrole;
