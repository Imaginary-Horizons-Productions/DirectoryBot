const { MessageEmbed, Message, GuildMember } = require('discord.js');
const fs = require('fs');
var encrypter = require('crypto-js');

exports.guildDictionary = {};

MessageEmbed.prototype.addBlankField = function (inline = false) {
    return this.addField('\u200B', '\u200B', inline);
}

Message.prototype.setToExpire = function (guildSpecifics, guildID, expirationText) {
    if (!guildSpecifics.expiringMessages[this.channel.id]) {
        guildSpecifics.expiringMessages[this.channel.id] = [this.id];
    } else {
        guildSpecifics.expiringMessages[this.channel.id].push(this.id);
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
            fs.writeFile(filePath, encrypter.AES.encrypt(JSON.stringify(guildSpecifics.expiringMessages), keyInput).toString(), 'utf8', (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
    })

    setTimeout(function () {
        this.edit(expirationText);
        guildSpecifics.expiringMessages[this.channel.id].shift();
    }, guildSpecifics.infoLifetime);
}

GuildMember.prototype.addPlatformRoles = function (guildSpecifics) {
    if (guildSpecifics.userDictionary[this.id]) {
        Object.keys(guildSpecifics.platformsList).forEach(platformName => {
            if (guildSpecifics.platformsList[platformName].roleID) {
                if (guildSpecifics.userDictionary[this.id][platformName] && guildSpecifics.userDictionary[this.id][platformName].value) {
                    console.log(guildSpecifics.platformsList[platformName].roleID);
                    this.roles.add(guildSpecifics.platformsList[platformName].roleID);
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

exports.creditsBuilder = function (footerURL) {
    return new MessageEmbed().setColor(`6b81eb`)
        .setAuthor(`Imaginary Horizons Productions`, `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
        .setTitle(`DirectoryBot Credits (Version 1.0)`)
        .setURL(`https://github.com/ntseng/DirectoryBot `)
        .addField(`Design & Engineering`, `Nathaniel Tseng ( <@106122478715150336> | [Twitter](https://twitter.com/Archainis) )`)
        .addField(`Engineering`, `Lucas Ensign ( <@112785244733628416> | [Twitter](https://twitter.com/SillySalamndr) )`)
        .addField(`Art`, `Angela Lee ( [Website](https://www.angelasylee.com/) )`)
        .addField(`\u200B`, `**__Patrons__**\nImaginary Horizons Productions is supported on [Patreon](https://www.patreon.com/imaginaryhorizonsproductions) by generous users like you, credited below.`)
        .addField(`Cartographer Tier`, `Ralph Beish`, false)
        .addField(`Explorer Tier`, `Eric Hu`, false)
        .setFooter(`Support development with "@DirectoryBot support"`, footerURL)
        .setTimestamp();
}

exports.supportBuilder = function (footerURL) {
    return new MessageEmbed().setColor('6b81eb')
        .setAuthor(`Imaginary Horizons Productions`, `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
        .setTitle(`Supporting DirectoryBot`)
        .setDescription(`Thank you for using DirectoryBot! Here are some ways to support development:`)
        .addField(`Vote for us on top.gg`, `top.gg is a Discord bot listing and distrabution service. Voting for DirectoryBot causes it to appear earlier in searches. (Link coming soon)`)
        .addField(`Contribute code`, `Check out our [GitHub](https://github.com/ntseng/DirectoryBot) and tackle some issues!`)
        .addField(`Create some social media buzz`, `Use the hashtags #DirectoryBotDiscord or #ImaginaryHorizonsProductions !`)
        .addField(`Become a Patron`, `Chip in for server costs at the [Imaginary Horizons Productions Patreon](https://www.patreon.com/imaginaryhorizonsproductions)!`)
        .setFooter(`Thanks in advanced!`, footerURL)
        .setTimestamp();
}

exports.saveManagerRole = function (guildID, managerRoleID, backup = false) {
    fs.readFile(`encryptionKey.txt`, 'utf8', (error, keyInput) => {
        if (error) {
            console.log(error);
        } else {
            var filePath = `./`;
            if (backup) {
                filePath += 'backups/';
                if (!fs.existsSync('./backups')) {
                    fs.mkdirSync('./backups');
                }
                if (!fs.existsSync('./backups/' + guildID)) {
                    fs.mkdirSync('./backups/' + guildID);
                }
            } else {
                filePath += 'data/';
                if (!fs.existsSync('./data')) {
                    fs.mkdirSync('./data');
                }
                if (!fs.existsSync('./data/' + guildID)) {
                    fs.mkdirSync('./data/' + guildID);
                }
            }
            filePath += guildID + '/managerRole.txt';
            fs.writeFile(filePath, encrypter.AES.encrypt(managerRoleID, keyInput).toString(), 'utf8', (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
    })
}

exports.savePermissionsRole = function (guildID, permissionsRoleID, backup = false) {
    fs.readFile(`encryptionKey.txt`, 'utf8', (error, keyInput) => {
        if (error) {
            console.log(error);
        } else {
            var filePath = `./`;
            if (backup) {
                filePath += 'backups/';
                if (!fs.existsSync('./backups')) {
                    fs.mkdirSync('./backups');
                }
                if (!fs.existsSync('./backups/' + guildID)) {
                    fs.mkdirSync('./backups/' + guildID);
                }
            } else {
                filePath += 'data/';
                if (!fs.existsSync('./data')) {
                    fs.mkdirSync('./data');
                }
                if (!fs.existsSync('./data/' + guildID)) {
                    fs.mkdirSync('./data/' + guildID);
                }
            }
            filePath += guildID + '/permissionsRole.txt';
            fs.writeFile(filePath, encrypter.AES.encrypt(permissionsRoleID, keyInput).toString(), 'utf8', (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
    })
}

exports.saveUserDictionary = function (guildID, userDictionary, backup = false) {
    fs.readFile("encryptionKey.txt", 'utf8', (error, keyInput) => {
        if (error) {
            console.log(error);
        } else {
            var filePath = `./`;
            if (backup) {
                filePath += 'backups/' + guildID + '/userDictionary.txt';
                if (!fs.existsSync('./backups')) {
                    fs.mkdirSync('./backups');
                }
                if (!fs.existsSync('./backups/' + guildID)) {
                    fs.mkdirSync('./backups/' + guildID);
                }
            } else {
                filePath += 'data/' + guildID + '/userDictionary.txt';
                if (!fs.existsSync('./data')) {
                    fs.mkdirSync('./data');
                }
                if (!fs.existsSync('./data/' + guildID)) {
                    fs.mkdirSync('./data/' + guildID);
                }
            }
            fs.writeFile(filePath, encrypter.AES.encrypt(JSON.stringify(userDictionary), keyInput).toString(), 'utf8', (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
    })
}

exports.savePlatformsList = function (guildID, platformsList, backup = false) {
    fs.readFile("encryptionKey.txt", 'utf8', (error, keyInput) => {
        if (error) {
            console.log(error);
        } else {
            var filePath = `./`;
            if (backup) {
                filePath += 'backups/' + guildID + '/platformsList.txt';
                if (!fs.existsSync('./backups')) {
                    fs.mkdirSync('./backups');
                }
                if (!fs.existsSync('./backups/' + guildID)) {
                    fs.mkdirSync('./backups/' + guildID);
                }
            } else {
                filePath += 'data/' + guildID + '/platformsList.txt';
                if (!fs.existsSync('./data')) {
                    fs.mkdirSync('./data');
                }
                if (!fs.existsSync('./data/' + guildID)) {
                    fs.mkdirSync('./data/' + guildID);
                }
            }
            fs.writeFile(filePath, encrypter.AES.encrypt(JSON.stringify(platformsList), keyInput).toString(), 'utf8', (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
    })
}

exports.saveBlockDictionary = function (guildID, blockDictionary, backup = false) {
    fs.readFile("encryptionKey.txt", 'utf8', (error, keyInput) => {
        if (error) {
            console.log(error);
        } else {
            var filePath = `./`;
            if (backup) {
                filePath += 'backups/' + guildID + '/blockDictionary.txt';
                if (!fs.existsSync('./backups')) {
                    fs.mkdirSync('./backups');
                }
                if (!fs.existsSync('./backups/' + guildID)) {
                    fs.mkdirSync('./backups/' + guildID);
                }
            } else {
                filePath += 'data/' + guildID + '/blockDictionary.txt';
                if (!fs.existsSync('./data')) {
                    fs.mkdirSync('./data');
                }
                if (!fs.existsSync('./data/' + guildID)) {
                    fs.mkdirSync('./data/' + guildID);
                }
            }
            fs.writeFile(filePath, encrypter.AES.encrypt(JSON.stringify(blockDictionary), keyInput).toString(), 'utf8', (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
    })
}
