const { MessageEmbed, Message, GuildMember } = require('discord.js');
const fs = require('fs');
var encrypter = require('crypto-js');

// guildID: locale
exports.guildLocales = {};

// guildID: Directory
exports.directories = {};

String.prototype.addVariables = function (variables) {
	let buffer = this;
	Object.keys(variables).forEach(key => {
		buffer = buffer.replace(`\${${key}}`, variables[key]);
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

exports.millisecondsToHours = function (locale, milliseconds, showMinutes = false, showSeconds = false) {
	var text = lessThanAnHour[locale];
	if (milliseconds >= 3600000) {
		text = `${Math.floor(milliseconds / 3600000)} ` + hours[locale];
	}

	if (showMinutes && Math.floor(milliseconds % 3600000 / 60000) > 0) {
		if (text == lessThanAnHour[locale]) {
			text = `${Math.floor(milliseconds % 3600000 / 60000)} ` + minutes[locale];
		} else {
			text += ` ${and[locale]} ${Math.floor(milliseconds % 3600000 / 60000)} ` + minutes[locale];
		}
	}

	if (showSeconds && Math.floor(milliseconds % 60000 / 1000) > 0) {
		if (text == lessThanAnHour[locale]) {
			text = `${Math.floor(milliseconds % 60000 / 1000)} ` + seconds[locale];
		} else {
			text += ` ${and[locale]} ${Math.floor(milliseconds % 60000 / 1000)} ` + seconds[locale];
		}
	}

	return text;
}

let lessThanAnHour = {
	"en_US": "less than an hour"
}

let and = {
	"en_US": "and"
}

let hours = {
	"en_US": "hour(s)"
}

let minutes = {
	"en_US": "minute(s)"
}

let seconds = {
	"en_US": "second(s)"
}

exports.platformsBuilder = function (guildName, platformsList, locale) {
	let listedPlatforms = Object.keys(platformsList).join(', ');

	return platformsMessage[locale].addVariables({
		"guild": guildName
	}) + listedPlatforms;
}

let platformsMessage = {
	"en_US": "${guild}'s tracked platforms are: "
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
