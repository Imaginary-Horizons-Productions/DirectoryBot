const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { saveObject } = require('./../helpers.js');
const { MessageMentions } = require('discord.js');

var command = new Command(false, false, false);
command.names = {
	"en_US": ["delete", "remove", "clear"]
}

command.summary = {
	"en_US": "Remove your information for a platform"
}

command.description = {
	"en_US": "This command removes your data for the given platform. Bot managers can use this command to remove information for other users."
}

command.sections = {
	"en_US": [
		new Section("Delete your data", "`@DirectoryBot delete (platform)`"),
		new Section("Delete another user's data", "`@DirectoryBot delete (user) (platform)`")
	]
}

command.execute = (receivedMessage, state, locale) => {
	// Removes the user's entry for the given platform, bot managers can remove for other users
	var platform = state.messageArray.filter(word => !word.match(MessageMentions.USERS_PATTERN))[0];
	if (platform) {
		platform = platform.toLowerCase();
		let mentionedGuildMembers = receivedMessage.mentions.members.array().filter(member => member.id != receivedMessage.client.user.id);
		var msgList = state.messageArray.slice(1);
		var reason = msgList.join(" ");

		if (Object.keys(state.platformsList).includes(platform)) {
			if (mentionedGuildMembers.length == 1) {
				if (mentionedGuildMembers[0]) {
					if (state.botManager) {
						var target = mentionedGuildMembers[0];

						if (state.userDictionary[target.id] && state.userDictionary[target.id][platform].value) {
							state.userDictionary[target.id][platform] = new FriendCode();
							if (state.platformsList[platform].roleID) {
								target.roles.remove(state.platformsList[platform].roleID);
							}
							target.send()
								.catch(console.error);
							saveObject(receivedMessage.guild.id, state.userDictionary, 'userDictionary.txt');
							receivedMessage.author.send(successOther[locale].addVariables({
								"target": target,
								"platform": platform,
								"term": state.platformsList[platform].term,
								"server": receivedMessage.guild.toString(),
								"reason": reason ? ` because ${reason}` : ""
							})).catch(console.error);
						} else {
							// Error Message
							receivedMessage.author.send(errorNoDataOther[locale].addVariables({
								"target": target,
								"platform": platform,
								"term": state.platformsList[platform].term,
								"server": receivedMessage.guild
							})).catch(console.error);
						}
					} else {
						// Error Message
						receivedMessage.author.send(errorNotManager[locale].addVariables({
							"role": state.managerRoleID ? ` or the role @${receivedMessage.guild.roles.resolve(cachedGuild.managerRoleID).name}` : ""
						})).catch(console.error);
					}
				} else {
					// Error Message
					receivedMessage.author.send(errorBadMember[locale].addVariables({
						"server": receivedMessage.guild
					})).catch(console.error);
				}
			} else {
				if (state.userDictionary[receivedMessage.author.id][platform] && state.userDictionary[receivedMessage.author.id][platform].value) {
					state.userDictionary[receivedMessage.author.id][platform] = new FriendCode();
					if (state.platformsList[platform].roleID) {
						receivedMessage.member.roles.remove(state.platformsList[platform].roleID);
					}
					receivedMessage.author.send(successSelf[locale].addVariables({
						"platform": platform,
						"term": state.platformsList[platform].term,
						"server": receivedMessage.guild
					})).catch(console.error);
					saveObject(receivedMessage.guild.id, state.userDictionary);
				} else {
					// Error Message
					receivedMessage.author.send(errorNoDataSelf[locale].addVariables({
						"platform": platform,
						"term": state.platformsList[platform].term,
						"server": receivedMessage.guild
					})).catch(console.error);
				}
			}
		} else {
			// Error Message
			receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`)
			receivedMessage.author.send(errorBadPlatform[locale].addVariables({
				"platform": platform,
				"server": receivedMessage.guild
			})).catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(errorNoPlatform[locale])
			.catch(console.error);
	}
}

let successOther = {
	"en_US": "Your ${platform} ${term} has been removed from ${server}${reason}."
}

let errorNoDataOther = {
	"en_US": "${target} does not have a ${platform} ${term} recorded in ${server}."
}

let errorNotManager = {
	"en_US": "You need a role with administrator privileges${role} to remove data for others."
}

let errorBadMember = {
	"en_US": "That person isn't a member of ${server}."
}

let successSelf = {
	"en_US": "You have removed your ${platform} ${term} from ${server}."
}

let errorNoDataSelf = {
	"en_US": "You do not currently have a ${platform} ${term} recorded in ${server}."
}

let errorBadPlatform = {
	"en_US": "${platform} is not currently being tracked in ${server}."
}

let errorNoPlatform = {
	"en_US": "Please provide the platform of the information to delete."
}

module.exports = command;
