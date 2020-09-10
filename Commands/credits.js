const Command = require('./../Classes/Command.js');
const Section = require('./../Classes/Section.js');
const { studioName, footerText } = require('./../localization.js');
const { MessageEmbed } = require('discord.js');

var command = new Command(false, false, true);
command.names = {
	"en_US": ["credits", "creditz", "about"]
}

command.summary = {
	"en_US": "Version info and contributors (using `help` on this command uses the command)"
}

// Description and Sections set for README generation
command.description = {	
	"en_US": "This command presents version info and contributors. Using `help` on this command uses the command."
}

command.sections = {
	"en_US": [
		new Section("Usage", "`@DirectoryBot creditz`")
	]
}

// Overwrite detailed help description with executing the command
command.help = (avatarURL, state, locale, guildName) => {
	return creditsBuilder(avatarURL, locale);
}

command.execute = (receivedMessage, state, locale) => {
	// Displays the credits
	receivedMessage.author.send(creditsBuilder(receivedMessage.client.user.avatarURL(), locale))
		.catch(console.error);
}

module.exports = command;

function creditsBuilder(footerURL, locale) {
	return new MessageEmbed().setColor(`6b81eb`)
		.setAuthor(studioName[locale], `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
		.setTitle(creditsTitle[locale].addVariables({"versionNumber": "2.0"}))
		.setURL(`https://github.com/Imaginary-Horizons-Productions/DirectoryBot `)
		.addField(designAndEngineering[locale], `Nathaniel Tseng ( <@106122478715150336> | [Twitter](https://twitter.com/Archainis) )`)
		.addField(engineering[locale], `Lucas Ensign ( <@112785244733628416> | [Twitter](https://twitter.com/SillySalamndr) )`)
		.addField(art[locale], `Angela Lee ( [Website](https://www.angelasylee.com/) )`)
		.addField(localization[locale], ``)
		.addField(`\u200B`, patronsDescription[locale])
		.addField(cartographerTier[locale], `Ralph Beish`, false)
		.addField(explorerTier[locale], `Eric Hu`, false)
		.setFooter(footerText[locale], footerURL)
		.setTimestamp();
}

let creditsTitle = {
	"en_US": "DirectoryBot Credits (Version ${versionNumber})"
}

let designAndEngineering = {
	"en_US": "Design & Engineering"
}

let engineering = {
	"en_US": "Engineering"
}

let art = {
	"en_US": "Art"
}

let localization = {
	"en_US": "Localization"
}

let patronsDescription = {
	"en_US": `**__Patrons__**\nImaginary Horizons Productions is supported on [Patreon](https://www.patreon.com/imaginaryhorizonsproductions) by generous users like you, credited below.`
}

let observerTier = {
	"en_US": "Observer Tier"
}

let dreamerTier = {
	"en_US": "Dreamer Tier"
}

let explorerTier = {
	"en_US": "Explorer Tier"
}

let cartographerTier = {
	"en_US": "Cartographer Tier"
}

let archivistTier = {
	"en_US": "Archivist Tier"
}

let grandArchivistTier = {
	"en_US": "Grand Archivist Tier"
}
