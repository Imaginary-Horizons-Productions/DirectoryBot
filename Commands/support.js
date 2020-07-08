const Command = require('./../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

var support = new Command();
support.names = ["support"];
support.summary = `Lists the ways to support development of DirectoryBot`;
support.managerCommand = false;

support.help = (clientUser, state) => {
    return supportBuilder(clientUser.displayAvatarURL());
}

support.execute = (receivedMessage, state, metrics) => {
    // Lists ways users can support development
    receivedMessage.author.send(supportBuilder(receivedMessage.client.user.displayAvatarURL()))
        .catch(console.error);
}

module.exports = support;

function supportBuilder(footerURL) {
    return new MessageEmbed().setColor('6b81eb')
        .setAuthor(`Imaginary Horizons Productions`, `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
        .setTitle(`Supporting DirectoryBot`)
        .setDescription(`Thank you for using DirectoryBot! Here are some ways to support development:`)
        .addField(`Vote for us on top.gg`, `top.gg is a Discord bot listing and distrabution service. Voting for DirectoryBot causes it to appear earlier in searches. (Link coming soon)`)
        .addField(`Contribute code`, `Check out our [GitHub](https://github.com/ntseng/DirectoryBot) and tackle some issues!`)
        .addField(`Create some social media buzz`, `Use the #ImaginaryHorizonsProductions hashtag!`)
        .addField(`Become a Patron`, `Chip in for server costs at the [Imaginary Horizons Productions Patreon](https://www.patreon.com/imaginaryhorizonsproductions)!`)
        .setFooter(`Thanks in advanced!`, footerURL)
        .setTimestamp();
}
