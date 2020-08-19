const Command = require('./../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

var command = new Command(["support"], `Lists the ways to support development of DirectoryBot`, false, false, false)
	// Description and Sections set for README generation
	.addDescription(`This command lists easy ways to support DirectoryBot development. Using \`help\` on this command uses the command.`)
	.addSection(`Usage`, `\`@DirectoryBot support\``);

// Overwrite detailed help description with executing the command
command.help = (clientUser, state) => {
	return supportBuilder(clientUser.displayAvatarURL());
}

command.execute = (receivedMessage, state, metrics) => {
	// Lists ways users can support development
	receivedMessage.author.send(supportBuilder(receivedMessage.client.user.displayAvatarURL()))
		.catch(console.error);
}

module.exports = command;

function supportBuilder(footerURL) {
	return new MessageEmbed().setColor('6b81eb')
		.setAuthor(`Imaginary Horizons Productions`, `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
		.setTitle(`Supporting DirectoryBot`)
		.setDescription(`Thank you for using DirectoryBot! Here are some ways to support development:`)
		.addField(`Vote for us on top.gg`, `top.gg is a Discord bot listing and distrabution service. Voting for DirectoryBot causes it to appear earlier in searches. [DirectoryBot's Page](https://top.gg/bot/585336216262803456)`)
		.addField(`Refer a friend`, `Got a friend interested in adding DirectoryBot to their server? Pass them [this link](https://discord.com/oauth2/authorize?client_id=585336216262803456&permissions=268446720&scope=bot)!`)
		.addField(`Contribute code`, `Check out our [GitHub](https://github.com/ntseng/DirectoryBot) and tackle some issues!`)
		.addField(`Create some social media buzz`, `Use the #ImaginaryHorizonsProductions hashtag!`)
		.addField(`Become a Patron`, `Chip in for server costs at the [Imaginary Horizons Productions Patreon](https://www.patreon.com/imaginaryhorizonsproductions)!`)
		.setFooter(`Thanks in advanced!`, footerURL)
		.setTimestamp();
}
