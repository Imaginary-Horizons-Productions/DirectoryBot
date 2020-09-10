const fs = require('fs');
const CommandSet = require('./../Classes/CommandSet.js');

// Each filename array may contain a maximum of 25 commands to conform with MessageEmbed limit of 25 fields
// General Commands: 12
let generalCommands = new CommandSet(false, ['help.js', 'record.js', 'import.js', 'tell.js', 'lookup.js', 'mydata.js', 'whois.js', 'delete.js', 'block.js', 'platforms.js', 'support.js', 'credits.js']);
generalCommands.name = {
	"en_US": "General Commands"
}

generalCommands.description = {
	"en_US": `To interact with DirectoryBot, mention the bot then type one of these commands:`
}

// Time Zone Commands: 2
let timezoneCommands = new CommandSet(false, ['convert.js', 'countdown.js']);
timezoneCommands.name = {
	"en_US": "Time Zone Commands"
}

timezoneCommands.description = {
	"en_US": `The time module contains commands for converting time zones, which users can store in the default platform "timezone".`
}

// Stream Commands: 2
let streamCommands = new CommandSet(false, ['multistream.js', 'shoutout.js']);
streamCommands.name = {
	"en_US": "Stream Commands"
}

streamCommands.description = {
	"en_US": `The streaming module contains commands for supporting live-streamers.`
}

// Configuration Commands: 9
let configCommands = new CommandSet(true, ['permissionsrole.js', 'managerrole.js', 'setlocale.js', 'datalifetime.js', 'newplatform.js', 'setplatformterm.js', 'setplatformrole.js', 'removeplatform.js']);
configCommands.name = {
	"en_US": "Configuration Commands"
}

configCommands.description = {
	"en_US": `The following commands can only be used by server members who have Discord administrator privledges or the role determined by \`setmanagerrole\`.`
}

exports.commandSets = [
	generalCommands,
	timezoneCommands,
	streamCommands,
	configCommands
];

var commandFileNames = [];
exports.commandSets.forEach(commandSet => {
	commandFileNames = commandFileNames.concat(commandSet.fileNames);
})
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js') && commandFileNames.includes(file));
var commandDictionary = {};

for (const file of commandFiles) {
	const command = require(`./${file}`);
	Object.keys(command.names).forEach(locale => {
		command.names[locale].forEach(alias => {
			if (commandDictionary[alias]) {
				// Set locale to null (so that the command handling defaults to guild locale)
				commandDictionary[alias].locale = null;
			} else {
				// Add overload to command dictionary
				commandDictionary[alias] = Object.create(command, {
					locale: {
						value: locale
					}
				})
			}
		})
	})
}

exports.commandDictionary = commandDictionary;
