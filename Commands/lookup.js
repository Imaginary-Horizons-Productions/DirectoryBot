const Command = require('./../Classes/Command.js');
const { MessageEmbed, MessageMentions } = require('discord.js');
const { millisecondsToHours } = require('./../helpers.js');

var command = new Command(["lookup"], `Look up someone else's information`, false, false, false)
	// Description set for README generation
	.addDescription(`This command messages you the entries a given platform. You can limit your results to a set of users by mentioning them at the end of the command.`)
	.addSection(`Look up a platform`, `\`@DirectoryBot lookup (platform)\``)
	.addSection(`Filter for users`, `\`@DirectoryBot lookup (platform) (users)\``);

// Generate embed on call to add up-to-date list of platforms
command.help = (clientUser, state) => {
	let embed = new MessageEmbed().setAuthor(`Imaginary Horizons Productions`, `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
		.setTitle(`DirectoryBot Command: ${command.names.join(', ')}`)
		.setDescription(command.description)
		.setFooter(`Support development with "@DirectoryBot support"`, clientUser.displayAvatarURL());

	command.sections.forEach(section => {
		embed.addField(section.title, section.text);
	})
	embed.addField(`This server's platforms`, Object.keys(state.cachedGuild.platformsList).join(', '));

	return embed;
}

command.execute = (receivedMessage, state, metrics) => {
	// Looks up platform data for the server or a set of users and sends it to the command user
	var platform = state.messageArray.filter(word => !word.match(MessageMentions.USERS_PATTERN))[0];
	if (platform) {
		platform = platform.toLowerCase();
		if (Object.keys(state.cachedGuild.platformsList).includes(platform)) {
			var text = `${state.cachedGuild.platformsList[platform].description}\n\n`;
			let userIDs = receivedMessage.mentions.members.keyArray().filter(id => id != receivedMessage.client.user.id);

			if (userIDs.length == 0) {
				userIDs = Object.keys(state.cachedGuild.userDictionary);
			}

			userIDs.forEach(id => {
				if (!(state.cachedGuild.blockDictionary[id] && state.cachedGuild.blockDictionary[id].includes(receivedMessage.author.id))) {
					if (state.cachedGuild.userDictionary[id] && state.cachedGuild.userDictionary[id][platform]) {
						if (state.cachedGuild.userDictionary[id][platform].value) {
							text += `${receivedMessage.guild.members.resolve(id).displayName}: ${state.cachedGuild.userDictionary[id][platform].value}\n`;
						}
					}
				}
			})

			if (text.length < 2049) {
				let embed = new MessageEmbed().setColor(`6b81eb`)
					.setAuthor(receivedMessage.guild.name, receivedMessage.guild.iconURL())
					.setTitle(`${state.command}: ${platform}`)
					.setDescription(text)
					.setFooter(`This message will expire in about ${millisecondsToHours(state.cachedGuild.infoLifetime)}.`, receivedMessage.client.user.avatarURL())
					.setTimestamp();
				receivedMessage.author.send(embed).then(sentMessage => {
					sentMessage.setToExpire(state.cachedGuild, receivedMessage.guild.id, `Your lookup of ${receivedMessage.guild.name}'s ${platform} ${state.cachedGuild.platformsList[platform].term}s has expired.`);
				}).catch(console.error);
			} else {
				// Error Message
				receivedMessage.author.send(`Your lookup of ${receivedMessage.guild.name}'s ${platform} ${state.cachedGuild.platformsList[platform].term} is too long for a single message, please limit your search (2,048 characters max).`)
					.catch(console.error);
			}
		} else {
			// Error Message
			receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`)
				.catch(console.error);
		}
	} else {
		// Error Message
		receivedMessage.author.send(`Please provide a platform in which to look up information.`)
			.catch(console.error);
	}
}

module.exports = command;
