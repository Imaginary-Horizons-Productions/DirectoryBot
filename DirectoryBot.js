const Discord = require('discord.js');
const { DateTime } = require("luxon");
const client = new Discord.Client();
const fs = require('fs');
var chrono = require('chrono-node');

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
var lookupOverloads = ["lookup"];
var deleteOverloads = ["delete", "remove", "clear"];
var platformsOverloads = ["platforms"];
var creditsOverloads = ["credits", "about"];
var setoproleOverloads = ["setoprole"];
var newplatformOverloads = ["newplatform"];
var removeplatformOverloads = ["removeplatform"];
var setplatformroleOverloads = ["setplatformrole"];

var opRole = "564275998515003392";
var userDictionary = new Object();
var platformsList = { "timezone": new PlatformData("default"), "twitch": new PlatformData("username") };


client.on('ready', () => {
    client.user.setActivity("\"@DirectoryBot help\"", { type: "LISTENING" });

    fs.readFile("opRole.json", (error, opRoleInput) => {
        if (error) {
            console.log(error);
        } else {
            opRole = opRoleInput;
        }
    });

    fs.readFile("userDictionary.json", (error, userDictionaryInput) => {
        if (error) {
            console.log(error);
        } else {
            Object.assign(userDictionary, JSON.parse(userDictionaryInput));
        }
    });

    fs.readFile("platformsList.json", (error, platformsListInput) => {
        if (error) {
            console.log(error);
        } else {
            Object.assign(platformsList, JSON.parse(platformsListInput));
        }
    });

    console.log("Connected as " + client.user.tag);
})

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) {
        return
    }

    //TODO anti-spam

    if (receivedMessage.mentions.users.has("585336216262803456")) { // DirectoryBot's Discord snowflake is: 585336216262803456
        var splitMessage = receivedMessage.content.split(" ");
        if (splitMessage[0].replace(/\D/g, "") == "585336216262803456") {
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
                if (helpOverloads.includes(arguments["words"][0])) {
                    helpCommand(arguments, receivedMessage);
                } else if (convertOverloads.includes(arguments["words"][0])) {
                    convertCommand(arguments, receivedMessage);
                } else if (countdownOverloads.includes(arguments["words"][0])) {
                    countdownCommand(arguments, receivedMessage);
                } else if (multistreamOverloads.includes(arguments["words"][0])) {
                    multistreamCommand(arguments, receivedMessage);
                } else if (recordOverloads.includes(arguments["words"][0])) {
                    recordCommand(arguments, receivedMessage);
                } else if (lookupOverloads.includes(arguments["words"][0])) {
                    lookupCommand(arguments, receivedMessage);
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
                } else if (removeplatformOverloads.includes(arguments["words"][0])) {
                    removePlatformCommand(arguments, receivedMessage);
                } else if (setplatformroleOverloads.includes(arguments["words"][0])) {
                    setPlatformRoleCommand(arguments, receivedMessage);
                } else if (Object.keys(platformsList).includes(arguments["words"][0])) {
                    lookupCommand(arguments, receivedMessage);
                } else {//TODO convert command shortcut if input starts with a time
                    receivedMessage.channel.send(`**DirectoryBot** doesn't have ${arguments["words"][0]} as one of its commands. Please check for typos or use \`@DirectoryBot help.\``)
                }
            }
        }
    }
})

//TODO going live notification
//TODO weekly stream schedule updates


function helpCommand(arguments, receivedMessage) {
    if (arguments["words"].length - 1 == 0) {
        receivedMessage.channel.send(`Here are all of **DirectoryBot**'s commands:\n\
*convert* - Convert a time to someone else's timezone or a given timezone\n\
*countdown* - How long until the given time\n\
*multistream* - Generate a multistream link for the given users\n\
*platforms* - Which games/services/information are currently tracked by **DirectoryBot**\n\
*record* - Record your information for a platform\n\
*lookup* - Look up someone else's information if they've recorded it\n\
*delete* - Remove your information for a platform\n\
*credits* - Version info and contributors\n\
(and *help*).\n\
You can type \`@directorybot help\` followed by one of those for specific instructions. If you are looking for operator commands, type \`@DirectoryBot help op\`.`);
    } else if (arguments["words"][1] == "admin" || arguments["words"][1] == "op" || arguments["words"][1] == "operator") {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(opRole)) {
            receivedMessage.author.send(`The operator commands are as follows:\n\
*newplatform* - Start tracking a new game/service/information\n\
*removeplatform* - Stop tracking a given game/service/information\n\
*setplatformrole* - Automatically add the given role to users who record information for the given platform\n\
*delete* for other users`);
        } else {
            receivedMessage.author.send(`You need a role with administrator privileges or the role " + receivedMessage.guild.roles.get(opRole) + " to view the operator commands.`);
        }
    } else if (convertOverloads.includes(arguments["words"][1])) {
        receivedMessage.channel.send(`The *convert* command calculates a time for a given user. For best results, place timezones between parentheses.\n\
Syntax: \`@DirectoryBot convert (time) in (starting timezone) for (user)\`\n\
\n\
The command can also be used to switch a time to a given timezone.\n\
Syntax: \`@DirectoryBot convert (time) in (starting timezone) to (resulting timezone)\`\n\
\n\
If you omit the starting timezone, the bot will assume you mean the timezone you've recorded for the \"timezone\" platform.`);
    } else if (countdownOverloads.includes(arguments["words"][1])) {
        receivedMessage.channel.send(`The *countdown* command states the time until the given time.\n\
Syntax: \`@DirectoryBot countdown (time) (timezone)\``);
    } else if (multistreamOverloads.includes(arguments["words"][1])) {
        receivedMessage.channel.send(`The *multistream* command generates a link to watch multiple streams simultaneously. Optionally, you can enter the layout number last if you want to specify that.\n\
Syntax: \`@DirectoryBot multistream (user1) (user2)... (layout)\``);
    } else if (recordOverloads.includes(arguments["words"][1])) {
        receivedMessage.channel.send(`The *record* command adds the code information you gave for the given platform so that the bot can use that information and people can ask the bot for it.\n\
Syntax: \`@DirectoryBot record (platform) (code)\``);
    } else if (lookupOverloads.includes(arguments["words"][1])) {
        receivedMessage.channel.send(`The *lookup* command tells you the information associted with the given user for the given platform.\n\
Syntax: \`@DirectoryBot lookup (user) (platform)\``);
    } else if (deleteOverloads.includes(arguments["words"][1])) {
        receivedMessage.channel.send(`The *delete* command removes your information for the given platform.\n\
Syntax: \`@DirectoryBot delete (platform)\``);
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(opRole)) {
            receivedMessage.author.send(`Operators can use the *delete* command to remove information for other users.\n\
Syntax: \`@DirectoryBot clear (user) (platform)\``);
        }
    } else if (platformsOverloads.includes(arguments["words"][1])) {
        platformsCommand(receivedMessage);
    } else if (creditsOverloads.includes(arguments["words"][1])) {
        creditsCommand(receivedMessage);
    } else if (setoproleOverloads.includes(arguments["words"][1])) {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(opRole)) {
            receivedMessage.author.send(`The *setoprole* command updates the operator role for **DirectoryBot**. Users with this role use operator features of this bot without serverwide administrator privileges.\n\
Syntax: \`@DirectoryBot setoprole (role)\``);
        } else {
            receivedMessage.author.send(`You need a role with administrator privileges or the role ${receivedMessage.guild.roles.get(opRole)} to view operator commands.`);
        }
    } else if (newplatformOverloads.includes(arguments["words"][1])) {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(opRole)) {
            receivedMessage.author.send(`The *newplatform* command specifies a new game/service/information for **DirectoryBot** to track for users.\n\
Syntax: \`@DirectoryBot newplatform (new game/service)\``);
        } else {
            receivedMessage.author.send(`You need a role with administrator privileges or the role ${receivedMessage.guild.roles.get(opRole)} to view operator commands.`);
        }
    } else if (removeplatformOverloads.includes(arguments["words"][1])) {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(opRole)) {
            receivedMessage.author.send(`The *removeplatform* command specifies a platform for **DirectoryBot** to stop tracking.\n\
Syntax: \`@DirectoryBot removeplatform (platform to remove)\``)
        } else {
            receivedMessage.author.send(`You need a role with administrator privileges or the role ${receivedMessage.guild.roles.get(opRole)} to view operator commands.`);
        }
    } else if (setplatformroleOverloads.includes(arguments["words"][1])) {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(opRole)) {
            receivedMessage.author.send(`The *setplatformrole* command associates the given role and platform. Anyone who records information for that platform will be automatically given the associated role.\n\
Syntax: \`@DirectoryBot setplatformrole (platform) (role)\``)
        } else {
            receivedMessage.author.send(`You need a role with administrator privileges or the role ${receivedMessage.guild.roles.get(opRole)} to view operator commands.`);
        }
    }
}


function convertCommand(arguments, receivedMessage) {
    var timeText = "";
    var startTimezone = "";
    var resultTimezone;

    //TODO check against convertOverloads here to adjust argument indexing after shortcut has been implemented

    if (arguments["userMentions"].length == 1) {
        for (var i = 0; i < arguments["words"].length; i++) {
            if (arguments["words"][i] == "in") {
                startTimezone = arguments["words"][i + 1]
                i++;
            } else if (arguments["words"][i] == "for") {
                break;
            } else if (arguments["words"][i] != "convert") {
                timeText += arguments["words"][i] + " ";
            }
        }
        resultTimezone = userDictionary[arguments["userMentions"][0].id]["timezone"];
    } else {
        for (var i = 0; i < arguments["words"].length; i++) {
            if (arguments["words"][i] == "in") {
                startTimezone = arguments["words"][i + 1]
                i++;
            } else if (arguments["words"][i] == "to") {
                resultTimezone = arguments["words"][i + 1];
                break;
            } else if (arguments["words"][i] != "convert") {
                timeText += arguments["words"][i] + " ";
            }
        }
    }
    if (startTimezone == "" || startTimezone == null) {
        if (userDictionary[receivedMessage.author.id] != null && userDictionary[receivedMessage.author.id]["timezone"].value != null) {
            startTimezone = userDictionary[receivedMessage.author.id]["timezone"].value;
        } else {
            receivedMessage.author.send(`Please either specifiy a timezone or record your default with \`@DirectoryBot record timezone (timezone)\`.`);
            return;
        }
    }
    timeText += "(" + startTimezone + ")";

    var inputTime = new chrono.parse(timeText); //BUG chrono misparses "9:00 PDT" as "9:00 PM"
    var dateTimeObject = DateTime.fromJSDate(inputTime[0].start.date());
    dateTimeObject.setZone(resultTimezone);

    if (arguments["userMentions"].length == 1) {
        receivedMessage.channel.send(`${arguments["words"][1]} in ${startTimezone} is ${dateTimeObject.toLocaleString(DateTime.TIME_SIMPLE)} for ${arguments["userMentions"][0]}.`);
    } else {
        receivedMessage.channel.send(`${arguments["words"][1]} in ${startTimezone} is ${dateTimeObject.toLocaleString(DateTime.TIME_SIMPLE)} in ${resultTimezone}.`);
    }
}


function countdownCommand(arguments, receivedMessage) {
    var timeText = "";
    for (var i = 0; i < arguments["words"].length; i++) {
        if (arguments["words"][i] != "countdown") {
            timeText += arguments["words"][i] + " ";
        }
    }

    var inputTime = new chrono.parse(timeText);
    var dateTimeObject = DateTime.fromJSDate(inputTime[0].start.date());
    var countdown = dateTimeObject.diffNow("minutes").toString();
    countdown = countdown.replace(/[a-zA-Z]/g, '');
    countdown = parseInt(countdown);

    receivedMessage.channel.send(`${arguments["words"][1]} is about ${countdown} minutes from now.`);
}


function multistreamCommand(arguments, receivedMessage) {
    var url = "https://multistre.am/";
    var layout = arguments["words"][1];

    for (var i = 0; i < arguments["userMentions"].length; i++) {
        if (!userDictionary[arguments["userMentions"][i].id]["twitch"].value) {
            receivedMessage.channel.send(`${arguments[i]} does not have a Twitch account logged with **DirectoryBot**.`)
            return;
        }
        url += userDictionary[arguments["userMentions"][i].id]["twitch"].value + "/";
    }
    if (layout) {
        url += "layout" + layout + "/";
    }

    receivedMessage.channel.send(`Here's the multistream link: ${url}`);
}


function recordCommand(arguments, receivedMessage) {
    var platform = arguments["words"][1].toLowerCase();
    var friendcode = arguments["words"][2];

    if (Object.keys(platformsList).includes(platform)) { // Early out if platform is not being tracked
        instantiateUserEntry(receivedMessage.author);
        userDictionary[receivedMessage.author.id][platform].value = friendcode;
        syncUserRolePlatform(receivedMessage.member, platform);
        saveUserDictionary();
        receivedMessage.author.send(`${receivedMessage.guild}'s **DirectoryBot** has recorded your ${platform} ${platformsList[platform].term} as ${friendcode}.`);
    } else {
        receivedMessage.author.send(`${receivedMessage.guild}'s **DirectoryBot** is not currently tracking a platform named ${platform}.`);
    }
}


function lookupCommand(arguments, receivedMessage) {
    if (arguments["userMentions"].length == 1) {
        var user = arguments["userMentions"][0].user;

        if (!user.bot) {
            if (lookupOverloads.includes(arguments["words"][0])) {
                var platform = arguments["words"][1].toLowerCase();
            } else {
                var platform = arguments["words"][0].toLowerCase();
            }

            if (Object.keys(platformsList).includes(platform)) {
                if (userDictionary[user.id] == null || userDictionary[user.id][platform].value == null) {
                    receivedMessage.channel.send(`${user} has not set a ${platform} ${platformsList[platform].term} in this server's **DirectoryBot** yet.`);
                } else {
                    receivedMessage.author.send(`${user}'s ${platform} ${platformsList[platform].term} is ${userDictionary[user.id][platform].value}.`);
                }
            } else {
                receivedMessage.author.send(`${receivedMessage.guild}'s **DirectoryBot** is not currently tracking ${platform} ${platformsList[platform].term}s.`);
            }
        } else {
            receivedMessage.channel.send(`${user} is a bot. Though bots do not have friend codes, Imaginary Horizons Productions, for one, welcomes our coming robot overlords.`);
        }
    } else {
        if (lookupOverloads.includes(arguments["words"][0])) {
            var platform = arguments["words"][1].toLowerCase();
        } else {
            var platform = arguments["words"][0].toLowerCase();
        }

        if (Object.keys(platformsList).includes(platform)) {
            var text = `Here are all the ${platform} ${platformsList[platform].term} in ${receivedMessage.guild}'s **DirectoryBot**:\n`;
            Object.keys(userDictionary).forEach(user => {
                if (userDictionary[user][platform].value != null) {
                    text += receivedMessage.guild.members.get(user).displayName + ": " + userDictionary[user][platform].value + "\n";
                }
            })
            receivedMessage.author.send(text);
        } else {
            receivedMessage.author.send(`${receivedMessage.guild}'s **DirectoryBot** is not currently tracking ${platform}.`);
        }
    }
}


function deleteCommand(arguments, receivedMessage) {
    var platform = arguments["words"][1].toLowerCase();

    if (arguments["userMentions"].length == 1) {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(opRole)) {
            if (Object.keys(platformsList).includes(platform)) {
                var target = arguments["userMentions"][0];

                if (userDictionary[target.id] != null && userDictionary[target.id][platform].value != null) {
                    userDictionary[target.id][platform] = new FriendCode();
                    target.send(`Your ${platformsList[platform].term} for ${receivedMessage.guild}'s **DirectoryBot** has been removed.`); //TODO allow a reason to be passed
                    syncUserRolePlatform(target, platform);
                    saveUserDictionary();
                    receivedMessage.author.send(`You have removed ${target}'s ${platform} ${platformsList[platform].term} from ${receivedMessage.guild}'s **DirectoryBot**.`);
                } else {
                    receivedMessage.author.send(`${target} does not have a ${platform} ${platformsList[platform].term} recorded in ${receivedMessage.guild}'s **DirectoryBot**.`);
                }
            } else {
                receivedMessage.author.send(`You need a role with administrator privileges or the role ${receivedMessage.guild.roles.get(opRole)} to remove ${platformsList[platform].term}s for others.`);
            }
        } else {
            receivedMessage.author.send(`${receivedMessage.guild}'s **DirectoryBot** is not currently tracking ${platform}.`)
        }
    } else {
        if (Object.keys(platformsList).includes(platform)) {
            if (userDictionary[receivedMessage.author.id] != null && userDictionary[receivedMessage.author.id][platform].value != null) {
                userDictionary[receivedMessage.author.id][platform] = new FriendCode();
                receivedMessage.author.send(`You have removed your ${platform} ${platformsList[platform].term} from ${receivedMessage.guild}'s **DirectoryBot**.`);
                syncUserRolePlatform(receivedMessage.member, platform);
                saveUserDictionary();
            } else {
                receivedMessage.author.send(`You do not currently have a ${platform} ${platformsList[platform].term} recorded in ${receivedMessage.guild}'s **DirectoryBot**.`);
            }
        } else {
            receivedMessage.author.send(`${receivedMessage.guild}'s **DirectoryBot** is not currently tracking ${platform}.`)
        }
    }
}


function platformsCommand(receivedMessage) {
    receivedMessage.channel.send(`**DirectoryBot** is currently tracking: ${Object.keys(platformsList)}`);
}


function creditsCommand(receivedMessage) { //TODO update patreon & github links
    receivedMessage.author.send(`Version 0.1 <GITHUB LINK GOES HERE>\n\
__Design & Engineering__\n\
Nathaniel Tseng ( <@106122478715150336> | <https://twitter.com/Archainis> )\n\
\n\
__Engineering__\n\
Lucas Ensign ( <@112785244733628416> | <https://twitter.com/SillySalamndr> )\n\
\n\
***DirectoryBot** supporters from Patreon: <PATREON LINK GOES HERE> `);
}


function setOpRoleCommand(arguments, receivedMessage) {
    if (arguments["roleMentions"].length > 0) {
        opRole = arguments["roleMentions"][0];
        receivedMessage.author.send(`Changing the operator role for ${receivedMessage.guild}'s **DirectoryBot** has succeeded.`);
        saveOpRole();
    } else {
        receivedMessage.author.send(`Please mention a role to set the ${receivedMessage.guild}'s **DirectoryBot** operator role to.`);
    }
}


function newPlatformCommand(arguments, receivedMessage) {
    if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(opRole)) {
        if (arguments["words"].length > 2) {
            receivedMessage.author.send("Please declare new platforms one at a time.");
        } else {
            if (arguments["words"].length <= 1) {
                receivedMessage.author.send("Please provide a name for the new platform.");
            } else {
                if (!platformsList[arguments["words"][1]]) {
                    platformsList[arguments["words"][1]] = new PlatformData();
                    receivedMessage.author.send(arguments["words"][1] + " has been added to the list of platforms that **DirectoryBot** is tracking.");
                    savePlatformsList();
                } else {
                    receivedMessage.author.send(`A platform for ${arguments["words"][1]} already exists.`)
                }
            }
        }
    } else {
        receivedMessage.author.send("You need a role with administrator privileges or the role " + receivedMessage.guild.roles.get(opRole) + " to add new platforms.");
    }
}


function removePlatformCommand(arguments, receivedMessage) {
    if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(opRole)) {
        if (Object.keys(platformsList).includes(arguments["words"][1])) {
            platformsList.splice(Object.keys(platformsList).indexOf(arguments["words"][1]), 1);
            Object.keys(userDictionary).forEach(user => {
                delete userDictionary[user][arguments["words"][1]];
            })
            receivedMessage.author.send(`${arguments["words"][1]} has been removed from ${receivedMessage.guild}'s **DirectoryBot**'s platforms.`);
            savePlatformsList();
        }
    } else {
        receivedMessage.author.send("You need a role with administrator privileges or the role " + receivedMessage.guild.roles.get(opRole) + " to remove platforms.");
    }
}


function setPlatformRoleCommand(arguments, receivedMessage) {
    var role = arguments['roleMentions'][0];
    var platform = arguments['words'][1];

    platformsList[platform].role = role;
    savePlatformsList();
    Object.keys(userDictionary).forEach(user => {
        syncUserRolePlatform(receivedMessage.guild.members.get(user), platform);
    })
    saveUserDictionary();
    receivedMessage.author.send(`**DirectoryBot** will now add @${receivedMessage.guild.roles.get(role).name} to users who set a ${platform.term} for ${platform} in ${receivedMessage.guild}.`);
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

function instantiateUserEntry(user) {
    if (!userDictionary[user.id]) {
        userDictionary[user.id] = new Object();
        Object.keys(platformsList).forEach((platformInList) => {
            userDictionary[user.id][platformInList] = new FriendCode();
        });
    }
}

function syncUserRolePlatform(member, platform) {
    if (userDictionary[member.id] && userDictionary[member.id] != null) {
        if (platformsList[platform].role) {
            if (userDictionary[member.id][platform].value == null) {
                member.removeRole(platformsList[platform].role);
            } else {
                member.addRole(platformsList[platform].role);
            }
        }
    }
}

function saveOpRole() {
    fs.writeFile('opRole.json', opRole, 'utf8', (error) => {
        if (error) {
            console.log(error);
        }
    })
}

function saveUserDictionary() {
    fs.writeFile('userDictionary.json', JSON.stringify(userDictionary), 'utf8', (error) => {
        if (error) {
            console.log(error);
        }
    })
}

function savePlatformsList() {
    fs.writeFile('platformsList.json', JSON.stringify(platformsList), 'utf8', (error) => {
        if (error) {
            console.log(error);
        }
    })
}


const authentication = require('./authentication.json');
fs.readFile("authentication.json", (error, botTokenInput) => {
    if (error) {
        console.log(error);
    } else {
        Object.assign(authentication, botTokenInput);
    }
});
client.login(authentication.token);