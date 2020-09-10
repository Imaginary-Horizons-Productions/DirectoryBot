const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { studioName } = require('./../localization.js');
const { MessageEmbed } = require('discord.js');

var command = new Command(false, false, false);
command.names = {
	"en_US": ["support"]
}

command.summary = {
	"en_US": "Lists the ways to support development of DirectoryBot"
}

// Description and Sections set for README generation
command.description = {
	"en_US": "This command lists easy ways to support DirectoryBot development. Using `help` on this command uses the command."
}

command.sections = {
	"en_US": [
		new Section("Usage", "`@DirectoryBot support`")
	]
}

// Overwrite detailed help description with executing the command
command.help = (avatarURL, state, locale, guildName) => {
	return supportBuilder(avatarURL, locale);
}

command.execute = (receivedMessage, state, locale) => {
	// Lists ways users can support development
	receivedMessage.author.send(supportBuilder(receivedMessage.client.user.displayAvatarURL(), locale))
		.catch(console.error);
}

module.exports = command;

function supportBuilder(footerURL, locale) {
	return new MessageEmbed().setColor('6b81eb')
		.setAuthor(studioName[locale], `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
		.setTitle(supportingDirectoryBot[locale])
		.setDescription(embedDescription[locale])
		.addField(vote[locale], voteText[locale])
		.addField(refer[locale], referText[locale])
		.addField(contribute[locale], contributeText[locale])
		.addField(social[locale], socialText[locale])
		.addField(patron[locale], patronText[locale])
		.setFooter(thanks[locale], footerURL)
		.setTimestamp();
}

let supportingDirectoryBot = {
	"en_US": "Supporting DirectoryBot"
}

let embedDescription = {
	"en_US": "Thank you for using DirectoryBot! Here are some ways to support development:"
}

let vote = {
	"en_US": "Vote for us on top.gg"
}

let voteText = {
	"en_US": "top.gg is a Discord bot listing and distrabution service. Voting for DirectoryBot causes it to appear earlier in searches. [DirectoryBot's Page](https://top.gg/bot/585336216262803456)"
}

let refer = {
	"en_US": "Refer a friend"
}

let referText = {
	"en_US": "Got a friend interested in adding DirectoryBot to their server? Pass them [this link](https://discord.com/oauth2/authorize?client_id=585336216262803456&permissions=268446720&scope=bot)!"
}

let contribute = {
	"en_US": "Contribute code or localization support"
}

let contributeText = {
	"en_US": "Check out our [GitHub](https://github.com/Imaginary-Horizons-Productions/DirectoryBot) and tackle some issues!"
}

let social = {
	"en_US": "Create some social media buzz"
}

let socialText = {
	"en_US": "Use the #ImaginaryHorizonsProductions hashtag!"
}

let patron = {
	"en_US": "Become a Patron"
}

let patronText = {
	"en_US": "Chip in for server costs at the [Imaginary Horizons Productions Patreon](https://www.patreon.com/imaginaryhorizonsproductions)!"
}

let thanks = {
	"en_US": "Thanks in advanced!"
}
