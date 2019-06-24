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
var newplatformOverloads = ["newplatform"];
var removeplatformOverloads = ["removeplatform"];
var setplatformroleOverloads = ["setplatformrole"];

var adminRole = "564275998515003392";
var userDictionary = new Object();
var platformsList = { "timezone": new PlatformData("default"), "twitch": new PlatformData("username") };


client.on('ready', () => {
    client.user.setActivity("\"@DirectoryBot help\"", { type: "LISTENING" });

    fs.readFile("adminRole.json", (error, adminRoleInput) => {
        if (error) {
            console.log(error);
        } else {
            Object.assign(adminRole, JSON.parse(adminRoleInput));
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
                "userMentions": FilterMentions(messageArray, receivedMessage.guild),
                "roleMentions": fetchRoleMentions(messageArray),
                "words": fetchArgs(messageArray) // First element is usually primary command
            };



            if (arguments["words"].length > 0) {
                if (helpOverloads.includes(arguments["words"][0])) {
                    HelpCommand(arguments, receivedMessage);
                } else if (convertOverloads.includes(arguments["words"][0])) {
                    ConvertCommand(arguments, receivedMessage);
                } else if (countdownOverloads.includes(arguments["words"][0])) {
                    CountdownCommand(arguments, receivedMessage);
                } else if (multistreamOverloads.includes(arguments["words"][0])) {
                    MultistreamCommand(arguments, receivedMessage);
                } else if (recordOverloads.includes(arguments["words"][0])) {
                    RecordCommand(arguments, receivedMessage);
                } else if (lookupOverloads.includes(arguments["words"][0])) {
                    LookupCommand(arguments, receivedMessage);
                } else if (deleteOverloads.includes(arguments["words"][0])) {
                    DeleteCommand(arguments, receivedMessage);
                } else if (platformsOverloads.includes(arguments["words"][0])) {
                    PlatformsCommand(arguments, receivedMessage);
                } else if (setadminroleOverloads.includes(arguments["words"][0])) {
                    SetAdminRoleCommand(arguments, receivedMessage);
                } else if (newplatformOverloads.includes(arguments["words"][0])) {
                    NewPlatformCommand(arguments, receivedMessage);
                } else if (removeplatformOverloads.includes(arguments["words"][0])) {
                    RemovePlatformCommand(arguments, receivedMessage);
                } else if (setplatformroleOverloads.includes(arguments["words"][0])) {
                    SavePlatformsList();
                } else if (Object.keys(platformsList).includes(arguments["words"][0])) {
                    LookupCommand(arguments, receivedMessage);
                } else {//TODO convert command shortcut if input starts with a time
                    receivedMessage.channel.send(`**DirectoryBot** doesn't have ${arguments["words"][0]} as one of its commands. Please check for typos or use \`@DirectoryBot help.\``)
                }
            }
        }
    }
})

//TODO going live notification
//TODO weekly stream schedule updates


function HelpCommand(arguments, receivedMessage) {
    if (arguments["words"].length - 1 == 0) {
        receivedMessage.channel.send("Here are all of **DirectoryBot**'s commands:\n\
*convert*\n\
*countdown*\n\
*multistream*\n\
*record*\n\
*lookup*\n\
*clear*\n\
*platforms*\n\
(and *help*).\n\
You can type `@directorybot help` followed by one of those for specific instructions. If you are looking for admin commands, type `@DirectoryBot help admin`.")
    } else if (arguments["words"][1] == "admin") {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(adminRole)) {
            receivedMessage.author.send("The admin commands are as follows:\n\
*newplatform*\n\
*removeplatform*\n\
*setplatformrole*\n\
*clear* for other users")
        } else {
            receivedMessage.author.send("You need a role with administrator privileges or the role " + receivedMessage.guild.roles.get(adminRole) + " to view the admin commands.");
        }
    } else if (arguments["words"][1] == "convert") {
        receivedMessage.channel.send("The *convert* command calculates a time for a given user. For best results, place timezones between parentheses ( <- these things -> ).\n\
Syntax: `@DirectoryBot convert (time) in (starting timezone) for (user)`\n\
\n\
The command can also be used to switch a time to a given timezone.\n\
Syntax: `@DirectoryBot convert (time) in (starting timezone) to (resulting timezone)`\n\
\n\
If you omit the starting timezone, the bot will assume you mean the timezone you've recorded for your \"timezone\" platform.")
    } else if (arguments["words"][1] == "countdown") {
        receivedMessage.channel.send("The *countdown* command states the time until the given time.\n\
Syntax: `@DirectoryBot countdown (time) (timezone)")
    } else if (arguments["words"][1] == "multistream") {
        receivedMessage.channel.send("The *multistream* command generates a link to watch multiple streams simultaneously. Optionally, you can enter the layout number last if you want to specify that.\n\
Syntax: `@DirectoryBot multistream (user1) (user2)... (layout)")
    } else if (arguments["words"][1] == "add") {
        receivedMessage.channel.send("The *add* command records your friend code (or timezone) for the given platform so that people can ask the bot for it.\n\
Syntax: `@DirectoryBot add (platform) (code)")
    } else if (arguments["words"][1] == "lookup") { //TODO "@DirectoryBot friendcode platform" to list everyones' codes for that platform
        receivedMessage.channel.send("The *lookup* command gives the information associted with the given user for the given platform.\n\
Syntax: `@DirectoryBot lookup (user) (platform)")
    } else if (arguments["words"][1] == "clear") {
        receivedMessage.channel.send("The *clear* command deletes your friend code for the specified platform.\n\
Syntax: `@DirectoryBot clear (platform)")
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(adminRole)) {
            receivedMessage.author.send("Admins can use the *clear* command to delete friend codes for other users.\n\
Syntax: `@DirectoryBot clear (user) (platform)")
        }
    } else if (arguments["words"][1] == "platforms") { //TODO list platforms
        receivedMessage.channel.send("The *platforms* command lists all the platforms **DirectoryBot** is currently tracking friend codes for.\n\
Syndax: `@DirectoryBot platforms")
    } else if (arguments["words"][1] == "setadminrole") {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(adminRole)) {
            receivedMessage.author.send("The *setadminrole* command updates the admin role for **DirectoryBot**. Users with this role use admin features of this bot without serverwide administrator priviledges.\n\
Syndax: `@DirectoryBot setadminrole (role)")
        } else {
            receivedMessage.author.send("You need a role with administrator privileges or the role " + receivedMessage.guild.roles.get(adminRole) + " to view the admin commands.");
        }
    } else if (arguments["words"][1] == "newplatform") {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(adminRole)) {
            receivedMessage.author.send("The *newplatform* command adds a new platform to the list of platforms **DirectoryBot** is tracks friend codes for.\n\
Syntax: `@DirectoryBot newplatform (name of new platform)`")
        } else {
            receivedMessage.author.send("You need a role with administrator privileges or the role " + receivedMessage.guild.roles.get(adminRole) + " to view the admin commands.");
        }
    } else if (arguments["words"][1] == "removeplatform") {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(adminRole)) {
            receivedMessage.author.send("The *removeplatforms* command removes the specified platform from the list of platforms **DirectoryBot** is tracks friend codes for.\n\
Syntax: `@DirectoryBot removeplatform (name of platform to remove)`")
        } else {
            receivedMessage.author.send("You need a role with administrator privileges or the role " + receivedMessage.guild.roles.get(adminRole) + " to view the admin commands.");
        }
    } else if (arguments["words"][1] == "setplatformrole") {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(adminRole)) {
            receivedMessage.author.send("The *setplatformrole* command associates the given role and platform. Anyone who records information for that role will be automatically given the associated role.\n\
Syntax: `@DirectoryBot setplatformrole (platform) (role)`")
        } else {
            receivedMessage.author.send("You need a role with administrator privileges or the role " + receivedMessage.guild.roles.get(adminRole) + " to view the admin commands.");
        }
    }
}


function ConvertCommand(arguments, receivedMessage) {
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


function CountdownCommand(arguments, receivedMessage) {
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


function MultistreamCommand(arguments, receivedMessage) {
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


function RecordCommand(arguments, receivedMessage) {
    var platform = arguments["words"][1].toLowerCase();
    var friendcode = arguments["words"][2];

    if (Object.keys(platformsList).includes(platform)) { // Early out if platform is not being tracked
        MakeNewUserEntryIfNeeded(receivedMessage.author);
        //TODO ask if user wants to overwrite or add to entry array (reaction option menu?)
        userDictionary[receivedMessage.author.id][platform].value = friendcode;
        receivedMessage.author.send(`${receivedMessage.guild}'s **DirectoryBot** has recorded your ${platform} ${platformsList[platform].term} as ${friendcode}.`);
        SaveUserDictionary();
    } else {
        receivedMessage.author.send(`${receivedMessage.guild}'s **DirectoryBot** is not currently tracking a platform named ${platform}.`);
    }
}


function LookupCommand(arguments, receivedMessage) {
    var user = arguments["userMentions"][0].user;

    if (!user.bot) {
        var platform;

        if (lookupOverloads.includes(arguments["words"][0])) {
            platform = arguments["words"][1].toLowerCase();
        } else {
            platform = arguments["words"][0].toLowerCase();
        }

        if (Object.keys(platformsList).includes(platform)) {
            if (userDictionary[user.id] == null || userDictionary[user.id][platform].value == null) {
                receivedMessage.channel.send(`${user} has not set a ${platformsList[platform].term} for ${platform} in this server's **DirectoryBot** yet.`);
            } else {
                receivedMessage.author.send(`${user}'s ${platformsList[platform].term} for ${platform} is ${userDictionary[user.id][platform].value}.`);
            }
        } else {
            receivedMessage.author.send(`${receivedMessage.guild}'s **DirectoryBot** is not currently tracking ${platform} ${platformsList[platform].term}s.`);
        }
    } else {
        receivedMessage.channel.send(`${user} is a bot. Though bots do not have friend codes, Imaginary Horizons Productions, for one, welcomes our coming robot overlords.`);
    }
}


function DeleteCommand(arguments, receivedMessage) {
    var platform = arguments["words"][1].toLowerCase();

    if (arguments["userMentions"].length == 1) {
        if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(adminRole)) {
            if (Object.keys(platformsList).includes(platform)) {
                var user = arguments["userMentions"][0].user;

                if (userDictionary[user.id] != null && userDictionary[user.id][platform].value != null) {
                    userDictionary[user.id][platform] = new FriendCode();
                    receivedMessage.author.send(`You have removed ${user}'s ${platformsList[platform].term} for ${platform} from ${receivedMessage.guild}'s **DirectoryBot**.`);
                    user.send(`Your ${platformsList[platform].term} for ${receivedMessage.guild}'s **DirectoryBot** has been removed.`); //TODO allow a reason to be passed
                    SaveUserDictionary();
                } else {
                    receivedMessage.author.send(`${user} does not have a ${platformsList[platform].term} for ${platform} recorded in ${receivedMessage.guild}'s **DirectoryBot**.`);
                }
            } else {
                receivedMessage.author.send(`You need a role with administrator privileges or the role ${receivedMessage.guild.roles.get(adminRole)} to remove ${platformsList[platform].term}s for others.`);
            }
        } else {
            receivedMessage.author.send(`${receivedMessage.guild}'s **DirectoryBot** is not currently tracking ${platform} ${platformsList[platform].term}s.`)
        }
    } else {
        if (Object.keys(platformsList).includes(platform)) {
            if (userDictionary[receivedMessage.author.id] != null && userDictionary[receivedMessage.author.id][platform].value != null) {
                userDictionary[receivedMessage.author.id][platform] = new FriendCode();
                receivedMessage.author.send(`You have removed your ${platformsList[platform].term} for ${platform} from ${receivedMessage.guild}'s **DirectoryBot**.`);
                SaveUserDictionary();
            } else {
                receivedMessage.author.send(`You do not currently have a ${platformsList[platform].term} for ${platform} recorded in ${receivedMessage.guild}'s **DirectoryBot**.`);
            }
        } else {
            receivedMessage.author.send(`${receivedMessage.guild}'s **DirectoryBot** is not currently tracking ${platform} ${platformsList[platform].term}s.`)
        }
    }
}


function PlatformsCommand(arguments, receivedMessage) {
    text = "DirectoryBot is currently tracking: "
    for (var i = 0; i < Object.keys(platformsList).length; i++) {
        text += Object.keys(platformsList)[i] + ", "
    }
    receivedMessage.channel.send(text)
}


function SetAdminRoleCommand(arguments, receivedMessage) {
    if (arguments["roleMentions"].length > 0) {
        adminRole = arguments["roleMentions"][0];
        receivedMessage.author.send(`Changing the admin role for ${receivedMessage.guild}'s **DirectoryBot** has succeeded.`);
        SaveAdminRole();
    } else {
        receivedMessage.author.send(`Please mention a role to set the ${receivedMessage.guild}'s **DirectoryBot** admin role to.`);
    }
}


function NewPlatformCommand(arguments, receivedMessage) {
    if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(adminRole)) {
        if (arguments["words"].length > 2) {//TODO consider if creating more than one platform at a time should be supported
            receivedMessage.author.send("Please declare new platforms one at a time.");
        } else {
            if (arguments["words"].length <= 1) {
                receivedMessage.author.send("Please provide a name for the new platform.");
            } else {
                if (!platformsList[arguments["words"][1]]) {
                    platformsList[arguments["words"][1]] = new PlatformData();
                    receivedMessage.author.send(arguments["words"][1] + " has been added to the list of platforms that **DirectoryBot** is tracking.");
                    SavePlatformsList();
                } else {
                    receivedMessage.author.send(`A platform for ${arguments["words"][1]} already exists.`)
                }
            }
        }
    } else {
        receivedMessage.author.send("You need a role with administrator privileges or the role " + receivedMessage.guild.roles.get(adminRole) + " to add new platforms.");
    }
}


function RemovePlatformCommand(arguments, receivedMessage) {
    if (receivedMessage.member.hasPermission('ADMINISTRATOR') || receivedMessage.member.roles.has(adminRole)) {
        if (Object.keys(platformsList).includes(arguments["words"][1])) {
            platformsList.splice(Object.keys(platformsList).indexOf(arguments["words"][1]), 1);
            Object.keys(userDictionary).forEach(user => {
                delete userDictionary[user][arguments["words"][1]];
            })
            receivedMessage.author.send(`${arguments["words"][1]} has been removed from ${receivedMessage.guild}'s **DirectoryBot**'s platforms.`);
            SavePlatformsList();
        }
    } else {
        receivedMessage.author.send("You need a role with administrator privileges or the role " + receivedMessage.guild.roles.get(adminRole) + " to remove platforms.");
    }
}

function FilterMentions(messageArray, guild) { // Fetch user mentions
    var mentionArray = [];
    for (var i = 0; i < messageArray.length; i += 1) {
        if (/<@!*[0-9]+>/.test(messageArray[i])) {
            var snowflakeString = messageArray[i].replace(/\D/g, '');
            mentionArray.push(guild.members.get(snowflakeString));
        }
    }
    return mentionArray;
}

function fetchRoleMentions(msgArray) { // Fetch role mention snowflakes
    var mentionArray = [];
    for (var i = 0; i < msgArray.length; i += 1) {
        if (/<@&[0-9]+>/.test(msgArray[i])) {
            mentionArray.push(msgArray[i].replace(/\D/g, ''));
        }
    }
    return mentionArray;
}

function fetchArgs(msgArray) { // Fetch arguments that are not mentions
    var argArray = [];
    for (var i = 0; i < msgArray.length; i += 1) {
        if (!/<@[!&]*[0-9]+>/.test(msgArray[i])) {
            argArray.push(msgArray[i]);
        }
    }
    return argArray;
}

function MakeNewUserEntryIfNeeded(user) {
    if (!userDictionary[user.id]) {
        userDictionary[user.id] = new Object();
        Object.keys(platformsList).forEach((platformInList) => {
            userDictionary[user.id][platformInList] = new FriendCode();
        });
    }
}

function SyncUserRoles() {

}

function SaveAdminRole() {
    fs.writeFile('adminRole.json', adminRole, 'utf8', (error) => {
        if (error) {
            console.log(error);
        }
    })
}

function SaveUserDictionary() {
    fs.writeFile('userDictionary.json', JSON.stringify(userDictionary), 'utf8', (error) => {
        if (error) {
            console.log(error);
        }
    })
}

function SavePlatformsList() {
    fs.writeFile('platformsList.json', JSON.stringify(platformsList), 'utf8', (error) => {
        if (error) {
            console.log(error);
        }
    })
}


client.login("NTg1MzM2MjE2MjYyODAzNDU2.XQVSew.ysyvtRI2LFOmrbMZ9GJRk-ZyAEg")