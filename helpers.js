const { MessageEmbed, Message, GuildMember } = require('discord.js');
const fs = require('fs');
const { getString } = require('./Localizations/localization.js');
var encrypter = require('crypto-js');

// guildID: locale
exports.guildLocales = {};

// guildID: Directory
exports.directories = {};

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

exports.millisecondsToHours = function (locale, milliseconds, showMinutes = false, showSeconds = false) {
	var text = getString(locale, "DirectoryBot", "lessThanAnHour");
	if (milliseconds >= 3600000) {
		text = `${Math.floor(milliseconds / 3600000)} ` +  getString(locale, "DirectoryBot", "hours");
	}

	if (showMinutes && Math.floor(milliseconds % 3600000 / 60000) > 0) {
		if (text ==  getString(locale, "DirectoryBot", "lessThanAnHour")) {
			text = `${Math.floor(milliseconds % 3600000 / 60000)} ` +  getString(locale, "DirectoryBot", "minutes");
		} else {
			text += ` ${ getString(locale, "DirectoryBot", "and")} ${Math.floor(milliseconds % 3600000 / 60000)} ` +  getString(locale, "DirectoryBot", "minutes");
		}
	}

	if (showSeconds && Math.floor(milliseconds % 60000 / 1000) > 0) {
		if (text ==  getString(locale, "DirectoryBot", "lessThanAnHour")) {
			text = `${Math.floor(milliseconds % 60000 / 1000)} ` +  getString(locale, "DirectoryBot", "seconds");
		} else {
			text += ` ${ getString(locale, "DirectoryBot", "and")} ${Math.floor(milliseconds % 60000 / 1000)} ` +  getString(locale, "DirectoryBot", "seconds");
		}
	}

	return text;
}

exports.platformsBuilder = function (guildName, platformsList, locale) {
	let platformTexts = [];
	for (const platform of Object.keys(platformsList)) {
		platformTexts.push(`${platform}${platformsList[platform].roleName ? " " + getString(locale, "DirectoryBot", "platformRole").addVariables({
			"role": platformsList[platform].roleName
		}) : ''}`);
	}

	let listedPlatforms = platformTexts.join(', ');
	return getString(locale, "DirectoryBot", "platformsMessage").addVariables({
		"guild": guildName
	}) + listedPlatforms;
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
