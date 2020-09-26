const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { saveObject } = require('./../helpers.js');
const { MessageMentions } = require('discord.js');

var command = new Command("delete", false, false, false);

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
							target.send(getString(locale, command.module, "deleteNotice").addVariables({
								"target": target,
								"platform": platform,
								"term": state.platformsList[platform].term,
								"server": receivedMessage.guild.toString(),
								"reason": reason ? ` because ${reason}` : ""
							})).catch(console.error);
							saveObject(receivedMessage.guild.id, state.userDictionary, 'userDictionary.txt');
							receivedMessage.channel.send(getString(locale, command.module, "successOther").addVariables({
								"target": target,
								"platform": platform,
								"term": state.platformsList[platform].term
							})).catch(console.error);
						} else {
							// Error Message
							receivedMessage.author.send(getString(locale, command.module, "errorNoDataOther").addVariables({
								"target": target,
								"platform": platform,
								"term": state.platformsList[platform].term,
								"server": receivedMessage.guild
							})).catch(console.error);
						}
					} else {
						// Error Message
						receivedMessage.author.send(getString(locale, "delete", "errorNotManager").addVariables({
							"role": state.managerRoleID ? ` or the role @${receivedMessage.guild.roles.resolve(cachedGuild.managerRoleID).name}` : ""
						})).catch(console.error);
					}
				} else {
					// Error Message
					receivedMessage.author.send(getString(locale, "delete", "errorBadMember").addVariables({
						"server": receivedMessage.guild
					})).catch(console.error);
				}
			} else {
				if (state.userDictionary[receivedMessage.author.id][platform] && state.userDictionary[receivedMessage.author.id][platform].value) {
					state.userDictionary[receivedMessage.author.id][platform] = new FriendCode();
					if (state.platformsList[platform].roleID) {
						receivedMessage.member.roles.remove(state.platformsList[platform].roleID);
					}
					receivedMessage.author.send(getString(locale, "delete", "successSelf").addVariables({
						"platform": platform,
						"term": state.platformsList[platform].term,
						"server": receivedMessage.guild
					})).catch(console.error);
					saveObject(receivedMessage.guild.id, state.userDictionary, 'userDictionary.txt');
				} else {
					// Error Message
					receivedMessage.author.send(getString(locale, "delete", "errorNoDataSelf").addVariables({
						"platform": platform,
						"term": state.platformsList[platform].term,
						"server": receivedMessage.guild
					})).catch(console.error);
				}
			}
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, "delete", "errorBadPlatform").addVariables({
				"platform": platform,
				"server": receivedMessage.guild
			})).catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, "delete", "errorNoPlatform"))
			.catch(console.error);
	}
}

module.exports = command;
