const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { MessageEmbed, MessageMentions } = require('discord.js');
const { millisecondsToHours } = require('./../helpers.js');

var command = new Command("lookup", false, false, false);

// Generate embed on call to add up-to-date list of platforms
command.help = (avatarURL, state, locale, guildName, module) => {
	let embed = new MessageEmbed().setAuthor(getString(locale, "DirectoryBot", "studioName"), `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
		.setTitle(getString(locale, "DirectoryBot", "directoryBotCommand") + getString(locale, module, "names").join(', '))
		.setDescription(getString(locale, module, "description"))
		.setFooter(getString(locale, "DirectoryBot", "footerText"), avatarURL);

	let headers = getString(locale, module, "headers");
	let texts = getString(locale, module, "texts");
	for (var i = 0; i < headers.length; i++) {
		embed.addField(headers[i], texts[i]);
	}

	return embed.addField(getString(locale, module, "detailedHelpPlatforms"), Object.keys(state.platformsList).join(', '));
}

command.execute = (receivedMessage, state, locale) => {
	// Looks up platform data for the server or a set of users and sends it to the command user
	var platform = state.messageArray.filter(word => !word.match(MessageMentions.USERS_PATTERN))[0];
	if (platform) {
		platform = platform.toLowerCase();
		if (Object.keys(state.platformsList).includes(platform)) {
			var text = `${state.platformsList[platform].description}\n\n`;
			let userIDs = receivedMessage.mentions.members.keyArray().filter(id => id != receivedMessage.client.user.id);

			if (userIDs.length == 0) {
				userIDs = Object.keys(state.userDictionary);
			}

			userIDs.forEach(id => {
				if (!(state.blockDictionary[id] && state.blockDictionary[id].includes(receivedMessage.author.id))) {
					if (state.userDictionary[id] && state.userDictionary[id][platform]) {
						if (state.userDictionary[id][platform].value) {
							text += `${receivedMessage.guild.members.resolve(id).displayName}: ${state.userDictionary[id][platform].value}\n`;
						}
					}
				}
			})

			if (text.length < 2049) {
				let embed = new MessageEmbed().setColor(`6b81eb`)
					.setAuthor(receivedMessage.guild.name, receivedMessage.guild.iconURL())
					.setTitle(`${state.command}: ${platform}`)
					.setDescription(text)
					.setFooter(getString(locale, "DirectoryBot", "expirationWarning").addVariables({ "time": millisecondsToHours(locale, state.infoLifetime)}), receivedMessage.client.user.avatarURL())
					.setTimestamp();

					if (state.platformsList[platform].roleID) {
						embed.addField(getString(locale, command.module, "platformRoleTitle"), getString(locale, command.module, "platformRoleText").addVariables({
							"term": state.platformsList[platform].term,
							"role": receivedMessage.guild.roles.resolve(state.platformsList[platform].roleID).name
						}))
					}
		
				receivedMessage.author.send(embed).then(sentMessage => {
					sentMessage.setToExpire(state, receivedMessage.guild.id, getString(locale, command.module, "expiredMessage").addVariables({
						"server": receivedMessage.guild.name,
						"platform": platform,
						"term": state.platformsList[platform].term
					}));
				}).catch(console.error);
			} else {
				// Error Message
				receivedMessage.author.send(getString(locale, command.module, "errorMessageOverflow").addVariables({
					"server": receivedMessage.guild.name,
					"platform": platform,
					"term": state.platformsList[platform].term
				})).catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(getString(locale, command.module, "errorBadPlatform").addVariables({
				"platform": platform,
				"server": receivedMessage.guild.name
			})).catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(getString(locale, command.module, "errorNoPlatform"))
			.catch(console.error);
	}
}

module.exports = command;
