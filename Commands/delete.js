const Command = require('./../Classes/Command.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { saveUserDictionary } = require('./../helpers.js');
const { MessageMentions } = require('discord.js');

var command = new Command(["delete", "remove", "clear"], `Remove your information for a platform`, false, false, false)
	.addDescription(`This command removes your data for the given platform. Bot managers can use this command to remove information for other users.`)
	.addSection(`Delete your data`, `\`@DirectoryBot delete (platform)\``)
	.addSection(`Delete another user's data`, `\`@DirectoryBot delete (user) (platform)\``);

command.execute = (receivedMessage, state, metrics) => {
	// Removes the user's entry for the given platform, bot managers can remove for other users
	var platform = state.messageArray.filter(word => !word.match(MessageMentions.USERS_PATTERN))[0];
	if (platform) {
		platform = platform.toLowerCase();
		let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);
		var msgList = state.messageArray.slice(1);
		var reason = msgList.join(" ");

		if (Object.keys(state.cachedGuild.platformsList).includes(platform)) {
			if (mentionedGuildMembers.length == 1) {
				if (mentionedGuildMembers[0]) {
					if (state.botManager) {
						var target = mentionedGuildMembers[0];

						if (state.cachedGuild.userDictionary[target.id] && state.cachedGuild.userDictionary[target.id][platform].value) {
							state.cachedGuild.userDictionary[target.id][platform] = new FriendCode();
							if (state.cachedGuild.platformsList[platform].roleID) {
								target.roles.remove(state.cachedGuild.platformsList[platform].roleID);
							}
							target.send(`Your ${platform} ${state.cachedGuild.platformsList[platform].term} has been removed from ${receivedMessage.guild}${reason ? ` because ${reason}` : ""}.`)
								.catch(console.error);
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
					if (state.cachedGuild.platformsList[platform].roleID) {
						receivedMessage.member.roles.remove(state.cachedGuild.platformsList[platform].roleID);
					}
					receivedMessage.author.send(`You have removed your ${platform} ${state.cachedGuild.platformsList[platform].term} from ${receivedMessage.guild}.`)
						.catch(console.error);
					saveUserDictionary(receivedMessage.guild.id, state.cachedGuild.userDictionary);
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

module.exports = command;
