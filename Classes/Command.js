const { MessageEmbed } = require('discord.js');

module.exports = class Command {
	constructor(namesInput, summaryInput, managerCommandInput, premiumCommandInput, dmCommandInput) {
		this.names = namesInput;
		this.description;
		this.sections = [];
		this.summary = summaryInput;
		this.managerCommand = managerCommandInput;
		this.premiumCommand = premiumCommandInput;
		this.dmCommand = dmCommandInput;
	}

	addDescription(text) {
		this.description = text;
		return this;
	}

	addSection(title, text) {
		this.sections.push(new Section(title, text));
		return this;
	}

	help(clientUser, state) {
		let embed = new MessageEmbed().setAuthor(`Imaginary Horizons Productions`, `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
			.setTitle(`DirectoryBot Command: ${this.names.join(', ')}`)
			.setDescription(this.description)
			.setFooter(`Support development with "@DirectoryBot support"`, clientUser.displayAvatarURL());

		this.sections.forEach(section => {
			embed.addField(section.title, section.text);
		})

		return embed;
	}

	execute(receivedMessage, state, metrics) { }
}

class Section {
	constructor(titleInput, textInput) {
		this.title = titleInput;
		this.text = textInput
	}
}
