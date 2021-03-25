const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const FriendCode = require('./../Classes/FriendCode.js');
const { directories, saveObject } = require('./../helpers.js');
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

		if (Object.keys(directories[receivedMessage.guild.id].platformsList).includes(platform)) {
			if (mentionedGuildMembers.length == 1) {
				if (mentionedGuildMembers[0]) {
					if (state.botManager) {
						var target = mentionedGuildMembers[0];

						if (directories[receivedMessage.guild.id].userDictionary[target.id] && directories[receivedMessage.guild.id].userDictionary[target.id][platform].value) {
							directories[receivedMessage.guild.id].userDictionary[target.id][platform] = new FriendCode();
							if (directories[receivedMessage.guild.id].platformsList[platform].roleID) {
								target.roles.remove(directories[receivedMessage.guild.id].platformsList[platform].roleID);
							}
							target.send(getString(locale, command.module, "deleteNotice").addVariables({
								"target": target,
								"platform": platform,
								"term": directories[receivedMessage.guild.id].platformsList[platform].term,
								"server": receivedMessage.guild.toString(),
								"reason": reason ? ` because ${reason}` : ""
							})).catch(console.error);
							saveObject(receivedMessage.guild.id, directories[receivedMessage.guild.id].userDictionary, 'userDictionary.txt');
							receivedMessage.channel.send(getString(locale, command.module, "successOther").addVariables({
								"target": target,
								"platform": platform,
								"term": directories[receivedMessage.guild.id].platformsList[platform].term
							})).catch(console.error);
						} else {
							// Error Message
							receivedMessage.author.send(getString(locale, command.module, "errorNoDataOther").addVariables({
								"target": target,
								"platform": platform,
								"term": directories[receivedMessage.guild.id].platformsList[platform].term,
								"server": receivedMessage.guild
							})).catch(console.error);
						}
					} else {
						// Error Message
						receivedMessage.author.send(getString(locale, "delete", "errorNotManager"))
							.catch(console.error);
					}
				} else {
					// Error Message
					receivedMessage.author.send(getString(locale, "delete", "errorBadMember").addVariables({
						"server": receivedMessage.guild
					})).catch(console.error);
				}
			} else {
				if (directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id][platform] && directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id][platform].value) {
					directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id][platform] = new FriendCode();
					if (directories[receivedMessage.guild.id].platformsList[platform].roleID) {
						receivedMessage.member.roles.remove(directories[receivedMessage.guild.id].platformsList[platform].roleID);
					}
					receivedMessage.author.send(getString(locale, "delete", "successSelf").addVariables({
						"platform": platform,
						"term": directories[receivedMessage.guild.id].platformsList[platform].term,
						"server": receivedMessage.guild
					})).catch(console.error);
					saveObject(receivedMessage.guild.id, directories[receivedMessage.guild.id].userDictionary, 'userDictionary.txt');
				} else {
					// Error Message
					receivedMessage.author.send(getString(locale, "delete", "errorNoDataSelf").addVariables({
						"platform": platform,
						"term": directories[receivedMessage.guild.id].platformsList[platform].term,
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
