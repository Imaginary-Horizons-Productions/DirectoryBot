const Command = require('./../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

var command = new Command(["credits", "creditz", "about"], `Version info and contributors (using \`help\` on this command uses the command)`, false, false, true)
	// Description and Sections set for README generation
	.addDescription(`This command presents version info and contributors. Using \`help\` on this command uses the command.`)
	.addSection(`Usage`, `\`@DirectoryBot creditz\``);

// Overwrite detailed help description with executing the command
command.help = (clientUser, state) => {
	return creditsBuilder(clientUser.avatarURL());
}

command.execute = (receivedMessage, state, metrics) => {
	// Displays the credits
	receivedMessage.author.send(creditsBuilder(receivedMessage.client.user.avatarURL()))
		.catch(console.error);
}

module.exports = command;

function creditsBuilder(footerURL) {
	return new MessageEmbed().setColor(`6b81eb`)
		.setAuthor(`Imaginary Horizons Productions`, `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
		.setTitle(`DirectoryBot Credits (Version 2.0)`)
		.setURL(`https://github.com/Imaginary-Horizons-Productions/DirectoryBot `)
		.addField(`Design & Engineering`, `Nathaniel Tseng ( <@106122478715150336> | [Twitter](https://twitter.com/Archainis) )`)
		.addField(`Engineering`, `Lucas Ensign ( <@112785244733628416> | [Twitter](https://twitter.com/SillySalamndr) )`)
		.addField(`Art`, `Angela Lee ( [Website](https://www.angelasylee.com/) )`)
		.addField(`\u200B`, `**__Patrons__**\nImaginary Horizons Productions is supported on [Patreon](https://www.patreon.com/imaginaryhorizonsproductions) by generous users like you, credited below.`)
		.addField(`Cartographer Tier`, `Ralph Beish`, false)
		.addField(`Explorer Tier`, `Eric Hu`, false)
		.setFooter(`Support development with "@DirectoryBot support"`, footerURL)
		.setTimestamp();
}
