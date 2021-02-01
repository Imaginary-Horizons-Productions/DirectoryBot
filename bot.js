const Discord = require('discord.js');
const fs = require('fs');
var encrypter = require('crypto-js');

require('./prototypes.js');
var helpers = require('./helpers.js');
const { getString } = require('./Localizations/localization.js');
const commandDictionary = require(`./Commands/CommandsList.js`).commandDictionary;
const Directory = require('./Classes/Directory.js');
const FriendCode = require('./Classes/FriendCode.js');

const client = new Discord.Client();

var versionData = require('./versionData.json');
var antiSpam = [];
var commandLimit = 3;
var antiSpamInterval = 5000;

login();

client.on('ready', () => {
	console.log("Connected as " + client.user.tag + "\n");

	// Post version notes
	if (versionData.showNotes && versionData.guildID) {
		client.guilds.resolve(versionData.guildID).channels.resolve(versionData.channelID).send(helpers.versionBuilder(client.user.displayAvatarURL())).then(message => {
			message.crosspost();
		}).catch(console.error);
		versionData.showNotes = false;
		fs.writeFile('versionData.json', JSON.stringify(versionData), 'utf8', error => {
			if (error) {
				console.error(error)
			}
		});
	}

	fs.readFile("encryptionKey.txt", 'utf8', (error, keyInput) => {
		if (error) {
			console.log(error);
		} else {
			Object.keys(helpers.guildLocales).forEach(guildID => {
				var guild = client.guilds.resolve(guildID);
				if (guild) {
					helpers.directories[guildID] = new Directory();

					fs.readFile(`./data/${guildID}/managerRole.txt`, 'utf8', (error, managerRoleInput) => {
						if (error) {
							console.log(error);
							helpers.saveObject(guildID, helpers.directories[guildID].managerRoleID, 'managerRole.txt');
						} else {
							helpers.directories[guildID].managerRoleID = encrypter.AES.decrypt(managerRoleInput, keyInput).toString(encrypter.enc.Utf8);
						}

						fs.readFile(`./data/${guildID}/permissionsRole.txt`, 'utf8', (error, permissionsRoleInput) => {
							if (error) {
								console.log(error);
								helpers.saveObject(guildID, helpers.directories[guildID].permissionsRoleID, 'permissionsRole.txt');
							} else {
								helpers.directories[guildID].permissionsRoleID = encrypter.AES.decrypt(permissionsRoleInput, keyInput).toString(encrypter.enc.Utf8)
							}

							fs.readFile(`./data/${guildID}/userDictionary.txt`, 'utf8', (error, userDictionaryInput) => {
								if (error) {
									console.log(error);
									helpers.saveObject(guildID, helpers.directories[guildID].platformsList, 'platformsList.txt');
								} else {
									Object.assign(helpers.directories[guildID].userDictionary, JSON.parse(encrypter.AES.decrypt(userDictionaryInput, keyInput).toString(encrypter.enc.Utf8)));
								}

								fs.readFile(`./data/${guildID}/platformsList.txt`, 'utf8', (error, platformsListInput) => {
									if (error) {
										console.log(error);
										helpers.saveObject(guildID, helpers.directories[guildID].userDictionary, 'userDictionary.txt');
									} else {
										Object.assign(helpers.directories[guildID].platformsList, JSON.parse(encrypter.AES.decrypt(platformsListInput, keyInput).toString(encrypter.enc.Utf8)));
									}

									fs.readFile(`./data/${guildID}/expiringMessages.txt`, 'utf8', (error, expiringMessagesInput) => {
										if (error) {
											console.log(error);
											if (!fs.existsSync('./data')) {
												fs.mkdirSync('./data');
											}
											if (!fs.existsSync('./data/' + guildID)) {
												fs.mkdirSync('./data/' + guildID);
											}
											var filePath = `./data/${guildID}/expiringMessages.txt`;
											fs.writeFile(filePath, encrypter.AES.encrypt(JSON.stringify({}), keyInput).toString(), 'utf8', (error) => {
												if (error) {
													console.log(error);
												}
											})
										} else {
											let expiringMessages = JSON.parse(encrypter.AES.decrypt(expiringMessagesInput, keyInput).toString(encrypter.enc.Utf8));
											Object.keys(expiringMessages).forEach(channelID => {
												client.channels.fetch(channelID).then(DMChannel => {
													expiringMessages[channelID].forEach(messageID => {
														DMChannel.messages.fetch(messageID).then(message => {
															message.edit(getString(helpers.directories[guildID].locale, "DirectoryBot", "expiredMessage"));
															message.suppressEmbeds(true);
														})
													})
												});
											})
											helpers.directories[guildID].expiringMessages = {};
										}

										fs.readFile(`./data/${guildID}/blockDictionary.txt`, 'utf8', (error, blockDictionaryInput) => {
											if (error) {
												console.log(error);
												helpers.saveObject(guildID, helpers.directories[guildID].blockDictionary, 'blockDictionary.txt');
											} else {
												Object.assign(helpers.directories[guildID].blockDictionary, JSON.parse(encrypter.AES.decrypt(blockDictionaryInput, keyInput).toString(encrypter.enc.Utf8)));
											}


											fs.readFile(`./data/${guildID}/infoLifetime.txt`, 'utf8', (error, infoLifetimeInput) => {
												if (error) {
													console.log(error);
													helpers.saveObject(guildID, 3600000, 'infoLifetime.txt');
												} else {
													helpers.directories[guildID].infoLifetime = encrypter.AES.decrypt(infoLifetimeInput, keyInput).toString(encrypter.enc.Utf8);
												}

												setInterval(() => {
													saveGuildLocales(true);
													Object.keys(helpers.directories).forEach((guildID) => {
														helpers.saveObject(guildID, helpers.directories[guildID].managerRoleID, 'managerRole.txt', true);
														helpers.saveObject(guildID, helpers.directories[guildID].permissionsRoleID, 'permissionsRole.txt', true);
														helpers.saveObject(guildID, helpers.directories[guildID].platformsList, 'platformsList.txt', true);
														helpers.saveObject(guildID, helpers.directories[guildID].userDictionary, 'userDictionary.txt', true);
														helpers.saveObject(guildID, helpers.directories[guildID].blockDictionary, 'blockDictionary.txt', true);
														helpers.saveObject(guildID, helpers.directories[guildID].infoLifetime, 'infoLifetime.txt', true);
													})
												}, 3600000)
											})
										})
									})
								});
							});
						})
					});
					console.log("Connected to: " + guild.toString());
				} else {
					guildDelete(guildID);
				}
			})
		}
	})

	client.user.setActivity(`"@DirectoryBot getstarted"`, { type: "LISTENING" }).catch(console.error);
})

client.on('message', (receivedMessage) => {
	if (receivedMessage.author.bot || receivedMessage.author.id == client.id) {
		return;
	}

	var messageArray = receivedMessage.content.split(" ").filter(element => {
		return element != "";
	});
	let firstWord = messageArray.shift();

	if (!firstWord) {
		return;
	}

	if (receivedMessage.guild) {
		// Guild Message Command
		if (!(helpers.directories[receivedMessage.guild.id] && Object.keys(helpers.guildLocales).includes(receivedMessage.guild.id))) {
			guildCreate(receivedMessage.guild.id, receivedMessage.guild.preferredLocale);
		}

		firstWord = firstWord.replace(/\D/g, "");
		if (messageArray.length > 0 && (firstWord == client.user.id || firstWord != '' && firstWord == helpers.directories[receivedMessage.guild.id].permissionsRoleID)) {
			if (!helpers.directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id]) {
				helpers.directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id] = {};
				Object.keys(helpers.directories[receivedMessage.guild.id].platformsList).forEach((platformInList) => {
					helpers.directories[receivedMessage.guild.id].userDictionary[receivedMessage.author.id][platformInList] = new FriendCode();
				});
			}

			var command = messageArray.shift();
			let directory = helpers.directories[receivedMessage.guild.id];
			if (commandDictionary[command]) {
				let locale = commandDictionary[command].locale || directory.locale || receivedMessage.author.locale || receivedMessage.guild.preferredLocale;

				var recentInteractions = 0;

				antiSpam.forEach(user => {
					if (user == receivedMessage.author.id) {
						recentInteractions++;
					}
				})

				if (recentInteractions < commandLimit) {
					var state = {
						"command": command, // The command alias used
						"messageArray": messageArray,
						"botManager": receivedMessage.member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR) || receivedMessage.member.roles.cache.has(helpers.directories[receivedMessage.guild.id].managerRoleID),
					};

					if (state.botManager || !commandDictionary[command].managerCommand) {
						commandDictionary[command].execute(receivedMessage, state, locale);
					} else {
						receivedMessage.author.send(getString(locale, "DirectoryBot", "errorNotManager").addVariables({
							"role": directory.managerRoleID ? ` or the @${receivedMessage.guild.roles.resolve(directory.managerRoleID).name} role` : ``,
							"alias": command
						})).catch(console.error);
					}

					antiSpam.push(receivedMessage.author.id);
					setTimeout(function () {
						antiSpam.shift();
					}, antiSpamInterval);
				} else {
					receivedMessage.author.send(getString(locale, "DirectoryBot", "errorTooManyCommands").addVariables({
						"commandLimit": commandLimit,
						"duration": helpers.millisecondsToHours(locale, antiSpamInterval, true, true),
						"botNickname": client.user
					})).catch(console.error);
				}
			} else {
				receivedMessage.author.send(getString(directory.locale, "DirectoryBot", "errorBadCommand").addVariables({
					"commandName": command,
					"botNickname": client.user
				})).catch(console.error);
			}
		}
	} else {
		// Direct Message Command
		let command = '';
		if (firstWord.replace(/\D/g, "") == client.user.id) {
			command = messageArray.shift();
		} else {
			command = firstWord;
		}

		if (commandDictionary[command]) {
			let locale = commandDictionary[command].locale || receivedMessage.author.locale;

			var recentInteractions = 0;

			antiSpam.forEach(user => {
				if (user == receivedMessage.author.id) {
					recentInteractions++;
				}
			})

			if (recentInteractions < commandLimit) {
				var state = {
					"command": command, // The command alias used
					"messageArray": messageArray,
				};

				if (commandDictionary[command].dmCommand) {
					commandDictionary[command].execute(receivedMessage, state, locale);
				} else {
					receivedMessage.author.send(getString(locale, "DirectoryBot", "errorNotPMCommand").addVariables({
						"command": state.command
					})).catch(console.error);
				}

				antiSpam.push(receivedMessage.author.id);
				setTimeout(function () {
					antiSpam.shift();
				}, antiSpamInterval);
			} else {
				receivedMessage.author.send(getString(locale, "DirectoryBot", "errorTooManyCommands").addVariables({
					"commandLimit": commandLimit,
					"duration": helpers.millisecondsToHours(locale, antiSpamInterval, true, true),
					"botNickname": client.user
				})).catch(console.error);
			}
		} else if (command) {
			receivedMessage.author.send(getString(receivedMessage.author.locale, "DirectoryBot", "errorBadCommand").addVariables({
				"commandName": command,
				"botNickname": client.user
			})).catch(console.error);
		}
	}
})


client.on('guildCreate', (guild) => {
	console.log(`Added to server (${Object.keys(client.guilds).length} total): ${guild.name}`);
	guildCreate(guild.id, guild.preferredLocale);
})


client.on('guildDelete', (guild) => {
	console.log(`Removed from server (${Object.keys(client.guilds).length} total)`);
	guildDelete(guild.id);
})


client.on('guildMemberRemove', (member) => {
	var guildID = member.guild.id;
	var memberID = member.id;
	var cachedGuild = helpers.directories[guildID];

	if (cachedGuild) {
		if (cachedGuild.userDictionary[memberID]) {
			delete cachedGuild.userDictionary[memberID];
			helpers.saveObject(guildID, cachedGuild.userDictionary, 'userDictionary.txt');
		}
	} else {
		guildCreate(guildID, member.guild.preferredLocale);
	}
})


client.on('disconnect', (error, code) => {
	console.log(`Disconnect encountered (Error code ${code}):`);
	console.log(error);
	console.log(`---Restarting`);
	login();
})


client.on('error', (error) => {
	console.log(`Error encountered:`);
	console.log(error);
	console.log(`---Restarting`);
	login();
})


client.on('roleUpdate', (oldRole, newRole) => {
	if (helpers.directories[newRole.guild.id]) {
		Object.values(helpers.directories[newRole.guild.id].platformsList).forEach(platform => {
			if (platform.roleID == newRole.id) {
				platform.roleName = newRole.name;
			}
		})
	} else {
		guildCreate(newRole.guild.id, newRole.guild.preferredLocale);
	}
})


function login() {
	fs.readFile(`encryptionKey.txt`, `utf8`, (error, keyInput) => {
		if (error) {
			console.log(error);
		} else {
			fs.readFile("guildsList.txt", 'utf8', (error, guildsListInput) => {
				if (error) {
					console.log(error);
				}

				if (!guildsListInput) {
					helpers.guildLocales = {};
					saveGuildLocales();
				} else {
					helpers.guildLocales = JSON.parse(encrypter.AES.decrypt(guildsListInput, keyInput).toString(encrypter.enc.Utf8));
				}

				let authentication = require("./authentication.json");
				client.login(authentication["token"]);
			});
		}
	})
}


function guildCreate(guildID, locale) {
	if (locale) {
		if (!helpers.guildLocales[guildID]) {
			helpers.guildLocales[guildID] = locale;
		}
		if (!helpers.directories[guildID]) {
			helpers.directories[guildID] = new Directory(locale);
		}
	} else {
		if (!helpers.guildLocales[guildID]) {
			helpers.guildLocales[guildID] = 'en-US';
		}
		if (!helpers.directories[guildID]) {
			helpers.directories[guildID] = new Directory('en-US');
		}
	}

	helpers.saveObject(guildID, helpers.directories[guildID].managerRoleID, 'managerRole.txt');
	helpers.saveObject(guildID, helpers.directories[guildID].permissionsRoleID, 'permissionsRole.txt');
	helpers.saveObject(guildID, helpers.directories[guildID].platformsList, 'platformsList.txt');
	helpers.saveObject(guildID, helpers.directories[guildID].userDictionary, 'userDictionary.txt');
	helpers.saveObject(guildID, helpers.directories[guildID].blockDictionary, 'blockDictionary.txt');
	helpers.saveObject(guildID, helpers.directories[guildID].infoLifetime, 'infoLifetime.txt');
	saveGuildLocales();
}

function guildDelete(guildID) {
	['data', 'backups'].forEach(fileSet => {
		if (fs.existsSync(`./${fileSet}/${guildID}`)) {
			fs.rmdirSync(`./${fileSet}/${guildID}`, { recursive: true });
		}
	})

	delete helpers.guildLocales[guildID];
	saveGuildLocales();
}

function saveGuildLocales(backup = false) {
	fs.readFile(`encryptionKey.txt`, `utf8`, (error, keyInput) => {
		if (error) {
			console.log(error);
		} else {
			var filePath = `./`;
			if (backup) {
				filePath += 'backups/guildsList.txt';
				if (!fs.existsSync('./backups')) {
					fs.mkdirSync('./backups');
				}
			} else {
				filePath += 'guildsList.txt';
			}
			fs.writeFile(filePath, encrypter.AES.encrypt(JSON.stringify(helpers.guildLocales), keyInput), 'utf8', (error) => {
				if (error) {
					console.log(error);
				}
			})
		}
	})
}
