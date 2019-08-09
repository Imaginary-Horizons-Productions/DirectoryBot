const Discord = require('discord.js');
const fs = require('fs');
var encrypter = require('crypto-js');
var timeModule = require('./DirectoryBot_TimeModule.js');
var twitchModule = require('./DirectoryBot_TwitchModule.js');

const client = new Discord.Client();

class GuildSpecifics {
    constructor(userDictionaryInput = {}, platformsListInput = { "possessivepronoun": new PlatformData("preference"), "timezone": new PlatformData("default"), "twitch": new PlatformData() }, opRoleInput = "") {
        this.userDictionary = userDictionaryInput;
        this.platformsList = platformsListInput;
        this.opRole = opRoleInput;
    }
}

class FriendCode {
    constructor(input = null) {
        this.value = input;
    }
}

class PlatformData {
    //TODO have multiple entries per platform
    constructor(input = "username") {
        this.term = input;
        this.description;
        this.role;
    }
}


var helpOverloads = ["help"];
var convertOverloads = ["convert"];
var countdownOverloads = ["countdown"];
var multistreamOverloads = ["multistream", "multitwitch"];
var recordOverloads = ["record", "log"];
var sendOverloads = ["send", "tell"];
var lookupOverloads = ["lookup"];
var whoisOverloads = ["whois"];
var deleteOverloads = ["delete", "remove", "clear"];
var platformsOverloads = ["platforms"];
var creditsOverloads = ["credits", "creditz", "about"];
var setoproleOverloads = ["setoprole"];
var newplatformOverloads = ["newplatform", "addplatform"];
var changeplatformtermOverloads = ["changeplatformterm"];
var removeplatformOverloads = ["removeplatform"];
var setplatformroleOverloads = ["setplatformrole"];

var participatingGuildsIDs = [];
var guildDictionary = {};

var antiSpam = [];
var commandLimit = 3;

fs.readFile(`encryptionKey.txt`, `utf8`, (error, keyInput) => {
    if (error) {
        console.log(error);
    } else {
        fs.readFile("guildsList.txt", 'utf8', (error, guildsListInput) => {
            if (error) {
                console.log(error);
            } else {
                participatingGuildsIDs = JSON.parse(encrypter.AES.decrypt(guildsListInput, keyInput).toString(encrypter.enc.Utf8))["list"];
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

client.on('ready', () => {
    fs.readFile("encryptionKey.txt", 'utf8', (error, keyInput) => {
        if (error) {
            console.log(error);
        } else {
            participatingGuildsIDs.forEach(guildID => {
                var newGuild = true;
                guildDictionary[guildID] = new GuildSpecifics();

                fs.readFile(`./data/${guildID}/opRole.txt`, 'utf8', (error, opRoleInput) => {
                    if (error) {
                        console.log(error);
                    } else {
                        guildDictionary[guildID].opRole = encrypter.AES.decrypt(opRoleInput, keyInput).toString(encrypter.enc.Utf8);
                        newGuild = false;
                    }

                    fs.readFile(`./data/${guildID}/userDictionary.txt`, 'utf8', (error, userDictionaryInput) => {
                        if (error) {
                            console.log(error);
                        } else {
                            Object.assign(guildDictionary[guildID].userDictionary, JSON.parse(encrypter.AES.decrypt(userDictionaryInput, keyInput).toString(encrypter.enc.Utf8)));
                            newGuild = false;
                        }

                        fs.readFile(`./data/${guildID}/platformsList.txt`, 'utf8', (error, platformsListInput) => {
                            if (error) {
                                console.log(error);
                            } else {
                                Object.assign(guildDictionary[guildID].platformsList, JSON.parse(encrypter.AES.decrypt(platformsListInput, keyInput).toString(encrypter.enc.Utf8)));
                                newGuild = false;
                            }

                            if (newGuild) {
                                saveOpRole(guildID);
                                savePlatformsList(guildID);
                                saveUserDictionary(guildID);
                            }

                            setInterval(() => {
                                saveParticipatingGuildsIDs(true);
                                Object.keys(guildDictionary).forEach((guildID) => {
                                    saveOpRole(guildID, true);
                                    savePlatformsList(guildID, true);
                                    saveUserDictionary(guildID, true);
                                })
                            }, 3600000)
                        });
                    });
                });
            })
        }
    })

    client.user.setActivity("\"@DirectoryBot help\"", { type: "LISTENING" });
    console.log("Connected as " + client.user.tag);
})

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
                messageArray = messageArray.slice(1);
                var arguments = {
                    "userMentions": filterMentions(messageArray, receivedMessage.guild),
                    "roleMentions": filterRoleMentions(messageArray),
                    "words": filterWords(messageArray) // First element is usually primary command
                };

                if (arguments["words"].length > 0) {
                    if (!guildDictionary[receivedMessage.guild.id].userDictionary[receivedMessage.author.id]) {
                        guildDictionary[receivedMessage.guild.id].userDictionary[receivedMessage.author.id] = {};
                        Object.keys(guildDictionary[receivedMessage.guild.id].platformsList).forEach((platformInList) => {
                            guildDictionary[receivedMessage.guild.id].userDictionary[receivedMessage.author.id][platformInList] = new FriendCode();
                        });
                    }

                    let clearCommand = true;

                    if (helpOverloads.includes(arguments["words"][0])) {
                        helpCommand(arguments, receivedMessage);
                    } else if (convertOverloads.includes(arguments["words"][0])) {
                        timeModule.convertCommand(arguments, receivedMessage, guildDictionary[receivedMessage.guild.id].userDictionary);
                    } else if (countdownOverloads.includes(arguments["words"][0])) {
                        timeModule.countdownCommand(arguments, receivedMessage, guildDictionary[receivedMessage.guild.id].userDictionary);
                    } else if (multistreamOverloads.includes(arguments["words"][0])) {
                        twitchModule.multistreamCommand(arguments, receivedMessage, guildDictionary[receivedMessage.guild.id].userDictionary);
                    } else if (recordOverloads.includes(arguments["words"][0])) {
                        recordCommand(arguments, receivedMessage);
                    } else if (lookupOverloads.includes(arguments["words"][0])) {
                        lookupCommand(arguments, receivedMessage);
                        clearCommand = false;
                    } else if (sendOverloads.includes(arguments["words"][0])) {
                        sendCommand(arguments, receivedMessage);
                    } else if (whoisOverloads.includes(arguments["words"][0])) {
                        whoisCommand(arguments, receivedMessage);
                    } else if (deleteOverloads.includes(arguments["words"][0])) {
                        deleteCommand(arguments, receivedMessage);
                    } else if (platformsOverloads.includes(arguments["words"][0])) {
                        platformsCommand(receivedMessage);
                    } else if (creditsOverloads.includes(arguments["words"][0])) {
                        creditsCommand(receivedMessage);
                    } else if (setoproleOverloads.includes(arguments["words"][0])) {
                        setOpRoleCommand(arguments, receivedMessage);
                    } else if (newplatformOverloads.includes(arguments["words"][0])) {
                        newPlatformCommand(arguments, receivedMessage);
                    } else if (changeplatformtermOverloads.includes(arguments["words"][0])) {
                        changePlatformTermCommand(arguments, receivedMessage);
                    } else if (removeplatformOverloads.includes(arguments["words"][0])) {
                        removePlatformCommand(arguments, receivedMessage);
                    } else if (setplatformroleOverloads.includes(arguments["words"][0])) {
                        setPlatformRoleCommand(arguments, receivedMessage);
                    } else if (Object.keys(guildDictionary[receivedMessage.guild.id].platformsList).includes(arguments["words"][0])) {
                        lookupCommand(arguments, receivedMessage);
                    } else {//TODO convert command shortcut if input starts with a time
                        receivedMessage.channel.send(`${arguments["words"][0]} isn't a DirectoryBot command. Please check for typos or use \`@DirectoryBot help.\``)
                    }

                    antiSpam.push(receivedMessage.author.id);
                    setTimeout(function () { antiSpam.shift(); }, 5000);
                    if (clearCommand) {
                        receivedMessage.delete();
                    }
                }
            } else {
                receivedMessage.author.send(`To prevent excessive messaging, users are unable to enter more than ${commandLimit} commands in 5 seconds. You can use \`@DirectoryBot lookup (platform)\` to look up everyone's information for the given platform at once.`);
            }
        }
    }
})


client.on('guildCreate', (guild) => {
    guildCreate(guild.id);
})


client.on('guildDelete', (guild) => {
    participatingGuildsIDs.splice(participatingGuildsIDs.indexOf(guild.id), 1);
    saveParticipatingGuildsIDs();
})


function helpCommand(arguments, receivedMessage) {
    let cachedGuild = guildDictionary[receivedMessage.guild.id];

    if (arguments["words"][1] == "admin" || arguments["words"][1] == "op" || arguments["words"][1] == "operator") {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(cachedGuild.opRole)) {
            receivedMessage.author.send(`The operator commands are as follows:\n\
*newplatform* - Setup a new game/service for users to record or retrieve information for\n\
*changeplatformterm* - Changes what DirectoryBot calls information for the given platform\n\
*removeplatform* - Stop recording and distributing user information for a game/service\n\
*setplatformrole* - Automatically give a role to users who record information for a platform\n\
*delete* for other users`);
        } else {
            receivedMessage.author.send(`You need a role with administrator privileges${cachedGuild.opRole ? ` or the role @${receivedMessage.guild.roles.get(cachedGuild.opRole).name}` : ""} to view the operator commands.`);
        }
    } else if (convertOverloads.includes(arguments["words"][1])) {
        receivedMessage.channel.send(`The *convert* command calculates a time for a given user. DirectoryBot uses IANA specified timezones.\n\
Syntax: \`@DirectoryBot convert (time) in (starting timezone) for (user)\`\n\
\n\
The command can also be used to switch a time to a given timezone.\n\
Syntax: \`@DirectoryBot convert (time) in (starting timezone) to (resulting timezone)\`\n\
\n\
If you omit the starting timezone, the bot will assume you mean the timezone you've recorded for the \"timezone\" platform.`);
    } else if (countdownOverloads.includes(arguments["words"][1])) {
        receivedMessage.channel.send(`The *countdown* command states the time until the given time. DirectoryBot uses IANA specified timezones. If no timezone is given DirectoryBot will try with the user's timezone default, then the server's local timezone failing that.\n\
Syntax: \`@DirectoryBot countdown (time) in (timezone)\``);
    } else if (multistreamOverloads.includes(arguments["words"][1])) {
        receivedMessage.channel.send(`The *multistream* command generates a link to watch multiple streams simultaneously. Optionally, you can enter the layout number last if you want to specify that.\n\
Syntax: \`@DirectoryBot multistream (user1) (user2)... (layout)\``);
    } else if (recordOverloads.includes(arguments["words"][1])) {
        receivedMessage.channel.send(`The *record* command adds the code information you gave for the given platform so that the bot can use that information and people can ask the bot for it.\n\
Syntax: \`@DirectoryBot record (platform) (code)\``);
    } else if (lookupOverloads.includes(arguments["words"][1])) {
        receivedMessage.channel.send(`The *lookup* command tells you the information associted with the given user for the given platform.\n\
Syntax: \`@DirectoryBot lookup (user) (platform)\`\n\
If you leave out the user mention, DirectoryBot will instead tell you everyone's information for that platform instead.\n\
Syntax: \`@DirectoryBot lookup (platform)`);
    } else if (sendOverloads.includes(arguments["words"][1])) {
        receivedMessage.channel.send(`The *send* command sends your information on the given platform to the given user.\n\
Syntax: \`@DirectoryBot send (platform) (user)\``);
    } else if (whoisOverloads.includes(arguments["words"][1])) {
        receivedMessage.channel.send(`The *whois* command checks if anyone uses the given username and private messages you the result.\n\
Syntax: \`@DirectoryBot whois (username)\``);
    } else if (deleteOverloads.includes(arguments["words"][1])) {
        receivedMessage.channel.send(`The *delete* command removes your information for the given platform.\n\
Syntax: \`@DirectoryBot delete (platform)\``);
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(cachedGuild.opRole)) {
            receivedMessage.author.send(`Operators can use the *delete* command to remove information for other users.\n\
Syntax: \`@DirectoryBot clear (user) (platform)\``);
        }
    } else if (platformsOverloads.includes(arguments["words"][1])) {
        platformsCommand(receivedMessage);
    } else if (creditsOverloads.includes(arguments["words"][1])) {
        creditsCommand(receivedMessage);
    } else if (setoproleOverloads.includes(arguments["words"][1])) {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(cachedGuild.opRole)) {
            receivedMessage.author.send(`The *setoprole* command updates the operator role for DirectoryBot. Users with this role use operator features of this bot without serverwide administrator privileges.\n\
Syntax: \`@DirectoryBot setoprole (role)\``);
        } else {
            receivedMessage.author.send(`You need a role with administrator privileges${cachedGuild.opRole ? ` or the role @${receivedMessage.guild.roles.get(cachedGuild.opRole).name}` : ""} to view operator commands.`);
        }
    } else if (newplatformOverloads.includes(arguments["words"][1])) {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(cachedGuild.opRole)) {
            receivedMessage.author.send(`The *newplatform* command sets up a new game/service for users to record and retrieve information. Optionally, you can set a term to call the information that is being stored (default is "username").\n\
Syntax: \`@DirectoryBot newplatform (platform name) (information term)\``);
        } else {
            receivedMessage.author.send(`You need a role with administrator privileges${cachedGuild.opRole ? ` or the role @${receivedMessage.guild.roles.get(cachedGuild.opRole).name}` : ""} to view operator commands.`);
        }
    } else if (changeplatformtermOverloads.includes(arguments["words"][1])) {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(cachedGuild.opRole)) {
            receivedMessage.author.send(`The *changeplatformterm* changes what DirectoryBot calls information from the given platform (default is "username").\n\
Syntax: \`@DirectoryBot changeplatformterm (platform name) (new term)\``);
        } else {
            receivedMessage.author.send(`You need a role with administrator privileges${cachedGuild.opRole ? ` or the role @${receivedMessage.guild.roles.get(cachedGuild.opRole).name}` : ""} to view operator commands.`);
        }
    } else if (removeplatformOverloads.includes(arguments["words"][1])) {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(cachedGuild.opRole)) {
            receivedMessage.author.send(`The *removeplatform* command specifies a platform for DirectoryBot to stop recording and distributing information for.\n\
Syntax: \`@DirectoryBot removeplatform (platform to remove)\``)
        } else {
            receivedMessage.author.send(`You need a role with administrator privileges${cachedGuild.opRole ? ` or the role @${receivedMessage.guild.roles.get(cachedGuild.opRole).name}` : ""} to view operator commands.`);
        }
    } else if (setplatformroleOverloads.includes(arguments["words"][1])) {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(cachedGuild.opRole)) {
            receivedMessage.author.send(`The *setplatformrole* command associates the given role and platform. Anyone who records information for that platform will be automatically given the associated role.\n\
Syntax: \`@DirectoryBot setplatformrole (platform) (role)\``)
        } else {
            receivedMessage.author.send(`You need a role with administrator privileges${cachedGuild.opRole ? ` or the role @${receivedMessage.guild.roles.get(cachedGuild.opRole).name}` : ""} to view operator commands.`);
        }
    } else {
        receivedMessage.channel.send(`Here are all of DirectoryBot's commands:\n\
*convert* - Convert a time to someone else's timezone or a given timezone\n\
*countdown* - How long until the given time\n\
*multistream* - Generate a multistream link for the given users\n\
*platforms* - List the games/services DirectoryBot can be used to record or retrieve information for (using help on this command uses the command)\n\
*record* - Record your information for a platform\n\
*lookup* - Look up someone else's information if they've recorded it\n\
*send* - Have DirectoryBot send someone your information\n\
*whois* - Ask DirectoryBot who a certain username belongs to\n\
*delete* - Remove your information for a platform\n\
*credits* - Version info and contributors (using help on this command uses the command)\n\
(and *help*).\n\
You can type \`@directorybot help\` followed by one of those for specific instructions. If you are looking for operator commands, type \`@DirectoryBot help op\`.`);
    }
}


function recordCommand(arguments, receivedMessage) {
    let cachedGuild = guildDictionary[receivedMessage.guild.id];

    var platform = arguments["words"][1].toLowerCase();
    var friendcode = arguments["words"][2];

    if (Object.keys(cachedGuild.platformsList).includes(platform)) { // Early out if platform is not being tracked
        if (cachedGuild.userDictionary[receivedMessage.author.id][platform]) {
            if (cachedGuild.userDictionary[receivedMessage.author.id][platform].value != friendcode) {
                cachedGuild.userDictionary[receivedMessage.author.id][platform].value = friendcode;
                syncUserRolePlatform(receivedMessage.member, platform, receivedMessage.guild.id);
                saveUserDictionary(receivedMessage.guild.id);
                receivedMessage.author.send(`Your ${platform} ${cachedGuild.platformsList[platform].term} has been recorded as ${friendcode} in ${receivedMessage.guild}.`);
            } else {
                receivedMessage.author.send(`You have already recorded ${friendcode} as your ${platform} ${cachedGuild.platformsList[platform].term} in ${receivedMessage.guild}.`)
            }
        }
    } else {
        receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`)
    }
}


function lookupCommand(arguments, receivedMessage) {
    let cachedGuild = guildDictionary[receivedMessage.guild.id];

    if (arguments["userMentions"].length == 1) {
        var user = arguments["userMentions"][0].user;

        if (!user.bot) {
            if (lookupOverloads.includes(arguments["words"][0])) {
                var platform = arguments["words"][1].toLowerCase();
            } else {
                var platform = arguments["words"][0].toLowerCase();
            }

            if (Object.keys(cachedGuild.platformsList).includes(platform)) {
                if (!cachedGuild.userDictionary[user.id] || !cachedGuild.userDictionary[user.id][platform].value) {
                    receivedMessage.channel.send(`${user} has not set a ${platform} ${cachedGuild.platformsList[platform].term} in this server's DirectoryBot yet.`);
                } else {
                    receivedMessage.author.send(`${user}'s ${platform} ${cachedGuild.platformsList[platform].term} is ${cachedGuild.userDictionary[user.id][platform].value}.`);
                }
            } else {
                receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`)
            }
        } else {
            receivedMessage.channel.send(`${user} is a bot. Though bots do not have friend codes, Imaginary Horizons Productions definitely welcomes our coming robot overlords.`);
        }
    } else {
        var platform = "";

        if (lookupOverloads.includes(arguments["words"][0])) {
            platform = arguments["words"][1].toLowerCase();
        } else {
            platform = arguments["words"][0].toLowerCase();
        }

        if (Object.keys(cachedGuild.platformsList).includes(platform)) {
            var text = `Here are all the ${platform} ${cachedGuild.platformsList[platform].term}s in ${receivedMessage.guild}'s DirectoryBot:\n`;
            Object.keys(cachedGuild.userDictionary).forEach(user => {
                if (cachedGuild.userDictionary[user][platform].value) {
                    text += receivedMessage.guild.members.get(user).displayName + ": " + cachedGuild.userDictionary[user][platform].value + "\n";
                }
            })
            receivedMessage.author.send(text);
        } else {
            receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`)
        }
    }
}


function sendCommand(arguments, receivedMessage) {
    let cachedGuild = guildDictionary[receivedMessage.guild.id];

    if (arguments["userMentions"].length >= 1) {
        var platform = arguments["words"][1].toLowerCase();
        if (Object.keys(cachedGuild.platformsList).includes(platform)) {
            if (cachedGuild.userDictionary[receivedMessage.author.id] && cachedGuild.userDictionary[receivedMessage.author.id][platform].value) {
                arguments["userMentions"].forEach(recipient => {
                    recipient.send(`${receivedMessage.author.username} has sent you ${cachedGuild.userDictionary[receivedMessage.author.id]["possessivepronoun"].value ? cachedGuild.userDictionary[receivedMessage.author.id]["possessivepronoun"].value : 'their'} ${platform} ${cachedGuild.platformsList[platform].term}. It is: ${cachedGuild.userDictionary[receivedMessage.author.id][platform].value}`);
                })
            } else {
                receivedMessage.author.send(`You have not recorded a ${platform} ${cachedGuild.platformsList[platform].term} in ${receivedMessage.guild}.`);
            }
        } else {
            receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`)
        }
    } else {
        receivedMessage.author.send(`Please mention someone to send your information to.`);
    }
}


function whoisCommand(arguments, receivedMessage) {
    let cachedGuild = guildDictionary[receivedMessage.guild.id];

    if (arguments["words"].length >= 1) {
        var searchTerm = arguments["words"][1];
        var reply = `The following people have recorded ${searchTerm} in ${receivedMessage.guild.name}:`;
        Object.keys(cachedGuild.userDictionary).forEach(user => {
            for (var platform in cachedGuild.userDictionary[user]) {
                if (cachedGuild.userDictionary[user][platform].value == searchTerm) {
                    reply += `\n${receivedMessage.guild.members.get(user).displayName} on ${platform}`;
                }
            }
        })

        receivedMessage.author.send(reply);
    } else {
        receivedMessage.author.send(`Please specify a username to check for.`);
    }
}


function deleteCommand(arguments, receivedMessage) {
    let cachedGuild = guildDictionary[receivedMessage.guild.id];

    var platform = arguments["words"][1].toLowerCase();

    if (arguments["userMentions"].length == 1) {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(cachedGuild.opRole)) {
            if (Object.keys(cachedGuild.platformsList).includes(platform)) {
                var target = arguments["userMentions"][0];

                if (cachedGuild.userDictionary[target.id] && cachedGuild.userDictionary[target.id][platform].value) {
                    cachedGuild.userDictionary[target.id][platform] = new FriendCode();
                    target.send(`Your ${cachedGuild.platformsList[platform].term} has been removed from ${receivedMessage.guild}.`); //TODO allow a reason to be passed
                    syncUserRolePlatform(target, platform, receivedMessage.guild.id);
                    saveUserDictionary(receivedMessage.guild.id);
                    receivedMessage.author.send(`You have removed ${target}'s ${platform} ${cachedGuild.platformsList[platform].term} from ${receivedMessage.guild}.`);
                } else {
                    receivedMessage.author.send(`${target} does not have a ${platform} ${cachedGuild.platformsList[platform].term} recorded in ${receivedMessage.guild}.`);
                }
            } else {
                receivedMessage.author.send(`You need a role with administrator privileges${cachedGuild.opRole ? ` or the role @${receivedMessage.guild.roles.get(cachedGuild.opRole).name}` : ""} to remove ${cachedGuild.platformsList[platform].term}s for others.`);
            }
        } else {
            receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`)
        }
    } else {
        if (Object.keys(cachedGuild.platformsList).includes(platform)) {
            if (cachedGuild.userDictionary[receivedMessage.author.id] && cachedGuild.userDictionary[receivedMessage.author.id][platform].value) {
                cachedGuild.userDictionary[receivedMessage.author.id][platform] = new FriendCode();
                receivedMessage.author.send(`You have removed your ${platform} ${cachedGuild.platformsList[platform].term} from ${receivedMessage.guild}.`);
                syncUserRolePlatform(receivedMessage.member, platform, receivedMessage.guild.id);
                saveUserDictionary(receivedMessage.guild.id);
            } else {
                receivedMessage.author.send(`You do not currently have a ${platform} ${cachedGuild.platformsList[platform].term} recorded in ${receivedMessage.guild}.`);
            }
        } else {
            receivedMessage.author.send(`${platform} is not currently being tracked in ${receivedMessage.guild}.`)
        }
    }
}


function platformsCommand(receivedMessage) {
    let processedText = Object.keys(guildDictionary[receivedMessage.guild.id].platformsList).toString().replace(/,/g, ', ');

    receivedMessage.channel.send(`This server's tracked platforms are: ${processedText}`);
}


function creditsCommand(receivedMessage) {
    receivedMessage.author.send(`Version B1.2.0 <https://github.com/ntseng/DirectoryBot>\n\
__Design & Engineering__\n\
Nathaniel Tseng ( <@106122478715150336> | <https://twitter.com/Archainis> )\n\
\n\
__Engineering__\n\
Lucas Ensign ( <@112785244733628416> | <https://twitter.com/SillySalamndr> )\n\
\n\
DirectoryBot supporters from Patreon: https://www.patreon.com/imaginaryhorizonsproductions `);
}


function setOpRoleCommand(arguments, receivedMessage) {
    let cachedGuild = guildDictionary[receivedMessage.guild.id];

    if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(cachedGuild.opRole)) {
        if (arguments["roleMentions"].length > 0) {
            if (cachedGuild.opRole != arguments["roleMentions"][0]) {
                cachedGuild.opRole = arguments["roleMentions"][0];
                receivedMessage.author.send(`The operator role for ${receivedMessage.guild}'s DirectoryBot has been set to @${receivedMessage.guild.roles.get(arguments["roleMentions"][0]).name}.`);
                saveOpRole(receivedMessage.guild.id);
            } else {
                receivedMessage.author.send(`${receivedMessage.guild.name}'s operator role already is @${receivedMessage.guild.roles.get(arguments["roleMentions"][0]).name}.`);
            }
        } else {
            receivedMessage.author.send(`Please mention a role to set the ${receivedMessage.guild}'s DirectoryBot operator role to.`);
        }
    } else {
        receivedMessage.author.send(`You need a role with administrator privileges${cachedGuild.opRole ? ` or the role @${receivedMessage.guild.roles.get(cachedGuild.opRole).name}` : ""} to change the operator role.`);
    }
}


function newPlatformCommand(arguments, receivedMessage) {
    let cachedGuild = guildDictionary[receivedMessage.guild.id];


    if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(cachedGuild.opRole)) {
        let platform = arguments["words"][1].toLowerCase();
        let term = arguments["words"][2];

        if (!cachedGuild.platformsList[platform]) {
            if (arguments["words"].length <= 1) {
                receivedMessage.author.send("Please provide a name for the new platform.");
            } else {
                cachedGuild.platformsList[platform] = new PlatformData();
                cachedGuild.platformsList[platform].term = term;
                Object.keys(cachedGuild.userDictionary).forEach((user) => {
                    cachedGuild.userDictionary[user][platform] = new FriendCode();
                })
                receivedMessage.channel.send(`${arguments["words"][1]} ${cachedGuild.platformsList[platform].term}s can now be recorded and retrieved.`);
                savePlatformsList(receivedMessage.guild.id);
            }
        } else {
            receivedMessage.author.send(`${arguments["words"][1]} ${cachedGuild.platformsList[platform].term}s can already be recorded and retrieved.`);
        }
    } else {
        receivedMessage.author.send(`You need a role with administrator privileges${cachedGuild.opRole ? ` or the role @${receivedMessage.guild.roles.get(cachedGuild.opRole).name}` : ""} to add new platforms.`);
    }
}


function changePlatformTermCommand(arguments, receivedMessage) {
    let cachedGuild = guildDictionary[receivedMessage.guild.id];

    if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(cachedGuild.opRole)) {
        let platform = arguments["words"][1];
        let term = arguments["words"][2];

        if (cachedGuild.platformsList[platform.toLowerCase()]) {
            cachedGuild.platformsList[platform.toLowerCase()].term = term;
            receivedMessage.author.send(`Information for ${platform} will now be referred to as ${term} in ${receivedMessage.guild}.`);
            savePlatformsList(receivedMessage.guild.id);
        } else {
            receivedMessage.author.send(`${platform} is not currently being recorded in ${receivedMessage.guild}.`);
        }
    } else {
        receivedMessage.author.send(`You need a role with administrator privileges${cachedGuild.opRole ? ` or the role @${receivedMessage.guild.roles.get(cachedGuild.opRole).name}` : ""} to change platform terms.`);
    }
}


function removePlatformCommand(arguments, receivedMessage) {
    let cachedGuild = guildDictionary[receivedMessage.guild.id];

    if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(cachedGuild.opRole)) {
        let platform = arguments["words"][1];

        if (cachedGuild.platformsList[platform.toLowerCase()]) {
            delete cachedGuild.platformsList[platform.toLowerCase()];
            Object.keys(cachedGuild.userDictionary).forEach(user => {
                delete cachedGuild.userDictionary[user][platform.toLowerCase()];
            })
            receivedMessage.author.send(`${platform} will no longer be recorded in ${receivedMessage.guild}.`);
            savePlatformsList(receivedMessage.guild.id);
        } else {
            receivedMessage.author.send(`${platform} is not currently being recorded in ${receivedMessage.guild}.`);
        }
    } else {
        receivedMessage.author.send(`You need a role with administrator privileges${cachedGuild.opRole ? ` or the role @${receivedMessage.guild.roles.get(cachedGuild.opRole).name}` : ""} to remove platforms.`);
    }
}


function setPlatformRoleCommand(arguments, receivedMessage) {
    let cachedGuild = guildDictionary[receivedMessage.guild.id];

    var role = arguments['roleMentions'][0];
    var platform = arguments['words'][1];

    if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(cachedGuild.opRole)) {
        if (cachedGuild.platformsList[platform].role != role) {
            cachedGuild.platformsList[platform].role = role;
            savePlatformsList(receivedMessage.guild.id);
            Object.keys(cachedGuild.userDictionary).forEach(user => {
                syncUserRolePlatform(receivedMessage.guild.members.get(user), platform, receivedMessage.guild.id);
            })
            saveUserDictionary(receivedMessage.guild.id);
            receivedMessage.author.send(`${receivedMessage.guild} members who set a ${platform} ${cachedGuild.platformsList[platform].term} will now automatically be given the role @${receivedMessage.guild.roles.get(role).name}.`);
        } else {
            receivedMessage.author.send(`The role @${receivedMessage.guild.roles.get(role).name} is already associated with ${platform} in ${receivedMessage.guild}.`);
        }
    } else {
        receivedMessage.author.send(`You need a role with administrator privileges${cachedGuild.opRole ? ` or the role @${receivedMessage.guild.roles.get(cachedGuild.opRole).name}` : ""} to remove platforms.`);
    }
}


function filterMentions(messageArray, guild) { // Fetch user mentions
    var mentionArray = [];
    for (var i = 0; i < messageArray.length; i += 1) {
        if (/<@!*[0-9]+>/.test(messageArray[i])) {
            var snowflakeString = messageArray[i].replace(/\D/g, '');
            mentionArray.push(guild.members.get(snowflakeString));
        }
    }
    return mentionArray;
}

function filterRoleMentions(msgArray) { // Fetch role mention snowflakes
    var mentionArray = [];
    for (var i = 0; i < msgArray.length; i += 1) {
        if (/<@&[0-9]+>/.test(msgArray[i])) {
            mentionArray.push(msgArray[i].replace(/\D/g, ''));
        }
    }
    return mentionArray;
}

function filterWords(msgArray) { // Fetch arguments that are not mentions
    var argArray = [];
    for (var i = 0; i < msgArray.length; i += 1) {
        if (!/<@[!&]*[0-9]+>/.test(msgArray[i])) {
            argArray.push(msgArray[i]);
        }
    }
    return argArray;
}

function guildCreate(guildID) {
    participatingGuildsIDs.push(guildID);

    guildDictionary[guildID] = new GuildSpecifics();
    saveOpRole(guildID);
    savePlatformsList(guildID);
    saveUserDictionary(guildID);

    saveParticipatingGuildsIDs();
}

function saveOpRole(guildID, backup = false) {
    fs.readFile(`encryptionKey.txt`, 'utf8', (error, keyInput) => {
        if (error) {
            console.log(error);
        } else {
            var filePath = `./`;
            if (backup) {
                filePath += 'backups/' + guildID + '/opRole.txt';
                if (!fs.existsSync('./backups')) {
                    fs.mkdirSync('./backups');
                }
                if (!fs.existsSync('./backups/' + guildID)) {
                    fs.mkdirSync('./backup/' + guildID);
                }
            } else {
                filePath += 'data/' + guildID + '/opRole.txt';
                if (!fs.existsSync('./data')) {
                    fs.mkdirSync('./data');
                }
                if (!fs.existsSync('./data/' + guildID)) {
                    fs.mkdirSync('./data/' + guildID);
                }
            }
            fs.writeFile(filePath, encrypter.AES.encrypt(guildDictionary[guildID].opRole, keyInput).toString(), 'utf8', (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
    })
}

function saveUserDictionary(guildID, backup = false) {
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
            fs.writeFile(filePath, encrypter.AES.encrypt(JSON.stringify(guildDictionary[guildID].userDictionary), keyInput).toString(), 'utf8', (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
    })
}

function savePlatformsList(guildID, backup = false) {
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
            fs.writeFile(filePath, encrypter.AES.encrypt(JSON.stringify(guildDictionary[guildID].platformsList), keyInput).toString(), 'utf8', (error) => {
                if (error) {
                    console.log(error);
                }
            })
        }
    })
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

function syncUserRolePlatform(member, platform, guildID) {
    if (guildDictionary[guildID].userDictionary[member.id]) {
        if (guildDictionary[guildID].platformsList[platform].role) {
            if (guildDictionary[guildID].userDictionary[member.id][platform].value) {
                member.addRole(guildDictionary[guildID].platformsList[platform].role);
            } else {
                member.removeRole(guildDictionary[guildID].platformsList[platform].role);
            }
        }
    }
}
