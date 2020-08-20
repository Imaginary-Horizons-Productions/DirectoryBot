const fs = require('fs');
const CommandSet = require('./../Classes/CommandSet.js');

// Each filename array may contain a maximum of 25 commands to conform with MessageEmbed limit of 25 fields
// General Commands: 12
// Time Zone Commands: 2
// Stream Commands: 2
// Configuration Commands: 8
exports.commandSets = [
	new CommandSet("General Commands", `To interact with DirectoryBot, mention the bot then type one of these commands:`, ['help.js', 'record.js', 'import.js', 'tell.js', 'lookup.js', 'mydata.js', 'whois.js', 'delete.js', 'block.js', 'platforms.js', 'support.js', 'credits.js'], false),
	new CommandSet("Time Zone Commands", `The time module contains commands for converting time zones, which users can store in the default platform "timezone".`, ['convert.js', 'countdown.js'], false),
	new CommandSet("Stream Commands", `The streaming module contains commands for supporting live-streamers.`, ['multistream.js', 'shoutout.js'], false),
	new CommandSet("Configuration Commands", `The following commands can only be used by server members who have Discord administrator privledges or the role determined by **setmanagerrole**.`, ['permissionsrole.js', 'managerrole.js', 'welcomemessage.js', 'datalifetime.js', 'newplatform.js', 'setplatformterm.js', 'setplatformrole.js', 'removeplatform.js'], true)
];

var commandFileNames = [];
exports.commandSets.forEach(commandSet => {
	commandFileNames = commandFileNames.concat(commandSet.fileNames);
})
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js') && commandFileNames.includes(file));
var commandDictionary = {};

for (const file of commandFiles) {
	const command = require(`./${file}`);
	command.names.forEach(overload => {
		commandDictionary[overload] = command;
	})
}

exports.commandDictionary = commandDictionary;
