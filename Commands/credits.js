const Command = require('./../Classes/Command.js');
const { getString } = require('./../Localizations/localization.js');
const { MessageEmbed } = require('discord.js');

var command = new Command("credits", false, false, true);

// Overwrite detailed help description with executing the command
command.help = (avatarURL, state, locale, guildName, module) => {
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
		.setAuthor(getString(locale, "DirectoryBot", "studioName"), `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
		.setTitle(getString(locale, command.module, "creditsTitle").addVariables({"versionNumber": "2.0"}))
		.setURL(`https://github.com/Imaginary-Horizons-Productions/DirectoryBot `)
		.addField(getString(locale, command.module, "designAndEngineering"), `Nathaniel Tseng ( <@106122478715150336> | [Twitter](https://twitter.com/Archainis) )`)
		.addField(getString(locale, command.module, "engineering"), `Lucas Ensign ( <@112785244733628416> | [Twitter](https://twitter.com/SillySalamndr) )`)
		.addField(getString(locale, command.module, "art"), `Angela Lee ( [Website](https://www.angelasylee.com/) )`)
//		.addField(getString(locale, "credits", "localization"), ``)
		.addField(`\u200B`, getString(locale, "credits", "patronsDescription"))
		.addField(getString(locale, command.module, "cartographerTier"), `Ralph Beish`, false)
		.addField(getString(locale, command.module, "explorerTier"), `Eric Hu`, false)
		.setFooter(getString(locale, "DirectoryBot", "footerText"), footerURL)
		.setTimestamp();
}
