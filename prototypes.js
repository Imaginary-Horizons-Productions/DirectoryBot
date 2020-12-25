const { MessageEmbed, Message, GuildMember } = require('discord.js');
const fs = require('fs');
const encrypter = require('crypto-js');

String.prototype.addVariables = function (variables) {
	var buffer = this;
	Object.keys(variables).forEach(key => {
		buffer = buffer.split(`\${${key}}`).join(variables[key]);
	})

	return buffer;
}

MessageEmbed.prototype.addBlankField = function (inline = false) {
	return this.addField('\u200B', '\u200B', inline);
}

Message.prototype.setToExpire = function (directory, guildID, expirationText) {
	if (!directory.expiringMessages[this.channel.id]) {
		directory.expiringMessages[this.channel.id] = [this.id];
	} else {
		directory.expiringMessages[this.channel.id].push(this.id);
	}
	fs.readFile("encryptionKey.txt", 'utf8', (error, keyInput) => {
		if (error) {
			console.log(error);
		} else {
			if (!fs.existsSync('./data')) {
				fs.mkdirSync('./data');
			}
			if (!fs.existsSync('./data/' + guildID)) {
				fs.mkdirSync('./data/' + guildID);
			}
			var filePath = `./data/${guildID}/expiringMessages.txt`;
			fs.writeFile(filePath, encrypter.AES.encrypt(JSON.stringify(directory.expiringMessages), keyInput).toString(), 'utf8', (error) => {
				if (error) {
					console.log(error);
				}
			})
		}
	})

	setTimeout(function (message) {
		message.edit(expirationText);
		message.suppressEmbeds(true);
		directory.expiringMessages[message.channel.id].shift();
	}, directory.infoLifetime, this);
}

GuildMember.prototype.addPlatformRoles = function (directory) {
	if (directory.userDictionary[this.id]) {
		Object.keys(directory.platformsList).forEach(platformName => {
			if (directory.platformsList[platformName].roleID) {
				if (directory.userDictionary[this.id][platformName] && directory.userDictionary[this.id][platformName].value) {
					this.roles.add(directory.platformsList[platformName].roleID);
				}
			}
		})
	}
}
