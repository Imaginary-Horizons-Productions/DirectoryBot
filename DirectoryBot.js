const Discord = require('discord.js');
const fs = require('fs');
var encrypter = require('crypto-js');

var helpers = require('./helpers.js');
const commandDictionary = require(`./Commands/CommandsList.js`).commandDictionary;
const GuildSpecifics = require('./Classes/GuildSpecifics.js');

const client = new Discord.Client();


var participatingGuildsIDs = [];
var guildDictionary = {};

var antiSpam = [];
var commandLimit = 3;
var antiSpamInterval = 5000;

login();

client.on('ready', () => {
    console.log("Connected as " + client.user.tag + "\n");
    fs.readFile("encryptionKey.txt", 'utf8', (error, keyInput) => {
        if (error) {
            console.log(error);
        } else {
            participatingGuildsIDs.forEach(guildID => {
                var guild = client.guilds.resolve(guildID);
                if (guild) {
                    guildDictionary[guildID] = new GuildSpecifics();

                    fs.readFile(`./data/${guildID}/managerRole.txt`, 'utf8', (error, managerRoleInput) => {
                        if (error) {
                            console.log(error);
                            helpers.saveManagerRole(guildID, guildDictionary[guildID].managerRoleID);
                        } else {
                            guildDictionary[guildID].managerRoleID = encrypter.AES.decrypt(managerRoleInput, keyInput).toString(encrypter.enc.Utf8);
                        }

                        fs.readFile(`./data/${guildID}/permissionsRole.txt`, 'utf8', (error, permissionsRoleInput) => {
                            if (error) {
                                console.log(error);
                                helpers.savePermissionsRole(guildID, guildDictionary[guildID].permissionsRoleID);
                            } else {
                                guildDictionary[guildID].permissionsRoleID = encrypter.AES.decrypt(permissionsRoleInput, keyInput).toString(encrypter.enc.Utf8)
                            }

                            fs.readFile(`./data/${guildID}/userDictionary.txt`, 'utf8', (error, userDictionaryInput) => {
                                if (error) {
                                    console.log(error);
                                    helpers.savePlatformsList(guildID, guildDictionary[guildID].platformsList);
                                } else {
                                    Object.assign(guildDictionary[guildID].userDictionary, JSON.parse(encrypter.AES.decrypt(userDictionaryInput, keyInput).toString(encrypter.enc.Utf8)));
                                }

                                fs.readFile(`./data/${guildID}/platformsList.txt`, 'utf8', (error, platformsListInput) => {
                                    if (error) {
                                        console.log(error);
                                        helpers.saveUserDictionary(guildID, guildDictionary[guildID].userDictionary);
                                    } else {
                                        Object.assign(guildDictionary[guildID].platformsList, JSON.parse(encrypter.AES.decrypt(platformsListInput, keyInput).toString(encrypter.enc.Utf8)));
                                    }

                                    fs.readFile(`./data/${guildID}/expiringMessages.txt`, 'utf8', (error, expiringMessagesInput) => {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            let expiringMessages = JSON.parse(encrypter.AES.decrypt(expiringMessagesInput, keyInput).toString(encrypter.enc.Utf8));
                                            Object.keys(expiringMessages).forEach(channelID => {
                                                let channel = client.channels.fetch(channelID).then(DMChannel => {
                                                    expiringMessages[channelID].forEach(messageID => {
                                                        DMChannel.messages.fetch(messageID).then(message => {
                                                            message.edit(`This message has expired.`);
                                                        })
                                                    })
                                                });
                                            })
                                            guildDictionary[guildID].expiringMessages = {};
                                        }

                                        helpers.savePermissionsRole(guildID, guildDictionary[guildID].permissionsRoleID);

                                        setInterval(() => {
                                            saveParticipatingGuildsIDs(true);
                                            Object.keys(guildDictionary).forEach((guildID) => {
                                                helpers.saveManagerRole(guildID, guildDictionary[guildID].managerRoleID, true);
                                                helpers.savePermissionsRole(guildID, guildDictionary[guildID].permissionsRoleID, true);
                                                helpers.savePlatformsList(guildID, guildDictionary[guildID].platformsList, true);
                                                helpers.saveUserDictionary(guildID, guildDictionary[guildID].userDictionary, true);
                                            })
                                        }, 3600000)
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

    client.user.setActivity(`@DirectoryBot help`, { type: "LISTENING" }).catch(console.error);
})

//TODO going live notification
/*
 * We don't currently have a URL (which is required for the Twitch API subscriber model).
 * When we get to implementing this after having a URL, we should consider using a helper module
 * like the one at https://openbase.io/js/twitch-webhook
 */
// exports.twitchSubscriber = function() {
//     //create server to send request to twitch API
//     https.get(``, response => {

//     }).on('error', console.error);
//     //create server to handle response
//     //save the way that we handle the subscription
// }

// exports.twitchUnsubscriber = function() {
//     //create server to send request to twitch API
//     https.get(``, response => {

//     }).on('error', console.error);
//     //create server to handle response
//     //remove saved information on how we handle the subscription
// }

// twitchEventHandler = https.createServer((request, response) => {
//     const {hearders, method, url} = request;

// });

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user || !receivedMessage.guild) {
        return;
    }

    if (receivedMessage.mentions.users.has(client.user.id)) {
        if (!participatingGuildsIDs.includes(receivedMessage.guild.id)) {
            guildCreate(receivedMessage.guild.id);
        }

        var splitMessage = receivedMessage.content.split(" ");
        if (splitMessage[0].replace(/\D/g, "") == client.user.id) {
            var recentInteractions = 0;

            antiSpam.forEach(user => {
                if (user == receivedMessage.author.id) {
                    recentInteractions++;
                }
            })

            if (recentInteractions < commandLimit) {
                var messageArray = splitMessage.filter(function (element) {
                    return element != "";
                });
                messageArray = messageArray.slice(1); // Discard bot mention

                if (messageArray.length > 0) {
                    var command = messageArray.shift();
                    var state = {
                        cachedGuild: guildDictionary[receivedMessage.guild.id], // GuildSpecifics for the current guild
                        command: command, // The primary command
                        messageArray: messageArray,
                        botManager: receivedMessage.member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR) || receivedMessage.member.roles.cache.has(guildDictionary[receivedMessage.guild.id].managerRoleID)
                    };

                    if (!state.cachedGuild.userDictionary[receivedMessage.author.id]) {
                        state.cachedGuild.userDictionary[receivedMessage.author.id] = {};
                        Object.keys(state.cachedGuild.platformsList).forEach((platformInList) => {
                            state.cachedGuild.userDictionary[receivedMessage.author.id][platformInList] = new FriendCode();
                        });
                    }

                    if (commandDictionary[command]) {
                        if (state.botManager || !commandDictionary[command].managerCommand) {
                            commandDictionary[command].execute(receivedMessage, state);
                        } else {
                            receivedMessage.author.send(`You need a role with the administrator flag${state.cachedGuild.managerRoleID != "" ? ` or the @${receivedMessage.guild.roles.resolve(cachedGuild.managerRoleID).name} role` : ``} to use the **${command}** command.`);
                        }

                        antiSpam.push(receivedMessage.author.id);
                        setTimeout(function () {
                            antiSpam.shift();
                        }, antiSpamInterval);
                    } else {
                        receivedMessage.author.send(`${command} isn't a ${client.user} command. Please check for typos or use ${client.user}\`help.\``)
                    }
                } else {
                    receivedMessage.author.send(`To prevent excessive messaging, users are unable to enter more than ${commandLimit} commands in ${helpers.millisecondsToHours(antiSpamInterval, true, true)}. You can use ${client.user} \`lookup (platform)\` to look up everyone's information for the given platform at once.`);
                }
            }
        }
    }
})


client.on('guildCreate', (guild) => {
    console.log(`Added to server: ${guild.name}`);
    guildCreate(guild.id);
})


client.on('guildDelete', (guild) => {
    guildDelete(guild.id);
})


client.on('guildMemberRemove', (member) => {
    var guildID = member.guild.id;
    var cachedGuild = guildDictionary[guildID];
    var memberID = member.id;

    if (cachedGuild) {
        if (cachedGuild.userDictionary[memberID]) {
            delete cachedGuild.userDictionary[memberID];
            saveUserDictionary(guildID);
        }
    } else {
        guildCreate(guildID);
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


function login() {
    fs.readFile(`encryptionKey.txt`, `utf8`, (error, keyInput) => {
        if (error) {
            console.log(error);
        } else {
            fs.readFile("guildsList.txt", 'utf8', (error, guildsListInput) => {
                if (error) {
                    console.log(error);
                } else {
                    if (guildsListInput == "") {
                        participatingGuildsIDs = [];
                        saveParticipatingGuildsIDs();
                    } else {
                        participatingGuildsIDs = JSON.parse(encrypter.AES.decrypt(guildsListInput, keyInput).toString(encrypter.enc.Utf8))["list"];
                    }
                }

                fs.readFile("authentication.json", 'utf8', (error, authenticationInput) => {
                    if (error) {
                        console.log(error);
                    } else {
                        var authentication = {};
                        Object.assign(authentication, JSON.parse(authenticationInput));
                        client.login(authentication["token"]);
                    }
                });
            });
        }
    })
}


function guildCreate(guildID) {
    participatingGuildsIDs.push(guildID);
    guildDictionary[guildID] = new GuildSpecifics();

    helpers.saveManagerRole(guildID, guildDictionary[guildID].managerRoleID);
    helpers.savePermissionsRole(guildID, guildDictionary[guildID].permissionsRoleID)
    helpers.savePlatformsList(guildID, guildDictionary[guildID].platformsList);
    helpers.saveUserDictionary(guildID, guildDictionary[guildID].userDictionary);
    saveParticipatingGuildsIDs();
}

function guildDelete(guildID) {
    if (fs.existsSync(`./data/${guildID}`)) {
        if (fs.existsSync(`./data/${guildID}/managerRole.txt`)) {
            fs.unlinkSync(`./data/${guildID}/managerRole.txt`, (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
        if (fs.existsSync(`./data/${guildID}/permissionsRole.txt`)) {
            fs.unlinkSync(`./data/${guildID}/permissionsRole.txt`, (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
        if (fs.existsSync(`./data/${guildID}/userDictionary.txt`)) {
            fs.unlinkSync(`./data/${guildID}/userDictionary.txt`, (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
        if (fs.existsSync(`./data/${guildID}/platformsList.txt`)) {
            fs.unlinkSync(`./data/${guildID}/platformsList.txt`, (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
        fs.rmdirSync(`./data/${guildID}`);
    }
    if (fs.existsSync(`./backups/${guildID}`)) {
        if (fs.existsSync(`./backups/${guildID}/managerRole.txt`)) {
            fs.unlinkSync(`./backups/${guildID}/managerRole.txt`, (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
        if (fs.existsSync(`./backups/${guildID}/permissionsRole.txt`)) {
            fs.unlinkSync(`./backups/${guildID}/permissionsRole.txt`, (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
        if (fs.existsSync(`./backups/${guildID}/userDictionary.txt`)) {
            fs.unlinkSync(`./backups/${guildID}/userDictionary.txt`, (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
        if (fs.existsSync(`./backups/${guildID}/platformsList.txt`)) {
            fs.unlinkSync(`./backups/${guildID}/platformsList.txt`, (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
        fs.rmdirSync(`./backups/${guildID}`, (error) => {
            if (error) {
                console.log(error);
            }
        })
    }

    participatingGuildsIDs.splice(participatingGuildsIDs.indexOf(guildID), 1);
    saveParticipatingGuildsIDs();
}

function saveParticipatingGuildsIDs(backup = false) {
    var guildsListOutput = { "list": participatingGuildsIDs };

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
            fs.writeFile(filePath, encrypter.AES.encrypt(JSON.stringify(guildsListOutput), keyInput), 'utf8', (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
    })
}
