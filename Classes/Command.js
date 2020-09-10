const { MessageEmbed } = require('discord.js');
const { studioName, footerText } = require('./../localization.js');

module.exports = class Command {
	constructor(managerCommandInput, premiumCommandInput, dmCommandInput) {
		this.names = {};
		this.summary = {};
		this.description = {};
		this.sections = {};
		this.managerCommand = managerCommandInput;
		this.premiumCommand = premiumCommandInput;
		this.dmCommand = dmCommandInput;
	}

	help(clientUser, state, locale, guildName) {
		let embed = new MessageEmbed().setAuthor(studioName[locale], `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
			.setTitle(`DirectoryBot Command: ${this.names[locale].join(', ')}`)
			.setDescription(this.description[locale])
			.setFooter(footerText[locale], clientUser.displayAvatarURL());

		this.sections[locale].forEach(section => {
			embed.addField(section.title, section.text);
		})

		return embed;
	}

	execute(receivedMessage, state, locale) { }
}
