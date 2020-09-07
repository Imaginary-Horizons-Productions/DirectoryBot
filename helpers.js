const { MessageEmbed, Message, GuildMember } = require('discord.js');
const fs = require('fs');
var encrypter = require('crypto-js');

// guildID: Directory
exports.directories = {};

String.prototype.addVariables = function (variables) {
	let buffer = this;
	for (const pair of variables) {
		buffer = buffer.replace(`\${${pair.key}}`, pair.value);
	}

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

exports.millisecondsToHours = function (milliseconds, showMinutes = false, showSeconds = false) {
	var text = "less than an hour";
	if (milliseconds >= 3600000) {
		text = `${Math.floor(milliseconds / 3600000)} hour(s)`;
	}

	if (showMinutes && Math.floor(milliseconds % 3600000 / 60000) > 0) {
		if (text == "less than an hour") {
			text = `${Math.floor(milliseconds % 3600000 / 60000)} minute(s)`;
		} else {
			text += ` and ${Math.floor(milliseconds % 3600000 / 60000)} minute(s)`;
		}
	}

	if (showSeconds && Math.floor(milliseconds % 60000 / 1000) > 0) {
		if (text == "less than an hour") {
			text = `${Math.floor(milliseconds % 60000 / 1000)} seconds(s)`;
		} else {
			text += ` and ${Math.floor(milliseconds % 60000 / 1000)} seconds(s)`;
		}
	}

	return text;
}

exports.platformsBuilder = function (platformsList) {
	let processedText = Object.keys(platformsList).toString().replace(/,/g, ', ');

	return `This server's tracked platforms are: ${processedText}`;
}

exports.saveObject = function (guildID, object, fileName, backup = false) {
	fs.readFile("encryptionKey.txt", 'utf8', (error, keyInput) => {
		if (error) {
			console.log(error);
		} else {
			var filePath = `./`;
			if (backup) {
				filePath += 'backups/' + guildID + '/' + fileName;
				if (!fs.existsSync('./backups')) {
					fs.mkdirSync('./backups');
				}
				if (!fs.existsSync('./backups/' + guildID)) {
					fs.mkdirSync('./backups/' + guildID);
				}
			} else {
				filePath += 'data/' + guildID + '/' + fileName;
				if (!fs.existsSync('./data')) {
					fs.mkdirSync('./data');
				}
				if (!fs.existsSync('./data/' + guildID)) {
					fs.mkdirSync('./data/' + guildID);
				}
			}
			fs.writeFile(filePath, encrypter.AES.encrypt(JSON.stringify(object), keyInput).toString(), 'utf8', (error) => {
				if (error) {
					console.log(error);
				}
			})
		}
	})
}
