const fs = require('fs');
const CommandSet = require('./../Classes/CommandSet.js');
const { getString, dictionary } = require('./../Localizations/localization.js');

// Each filename array may contain a maximum of 25 commands to conform with MessageEmbed limit of 25 fields
// General Commands: 11
let generalCommands = new CommandSet("generalCommands", false, ['record.js', 'import.js', 'tell.js', 'lookup.js', 'mydata.js', 'whois.js', 'delete.js', 'block.js', 'platforms.js', 'raffle.js', "feedback.js"]);
// Informational Commands: 6
let infoCommands = new CommandSet("infoCommands", false, ['getstarted.js', 'about.js', 'help.js', 'support.js', 'datapolicy.js', 'version.js']);
// Time Zone Commands: 2
let timezoneCommands = new CommandSet("timeZoneCommands", false, ['convert.js', 'countdown.js']);
// Stream Commands: 2
let streamCommands = new CommandSet("streamCommands", false, ['multistream.js', 'shoutout.js']);
// Configuration Commands: 9
let configCommands = new CommandSet("configCommands", true, ['permissionsrole.js', 'setlocale.js', 'datalifetime.js', 'newplatform.js', 'setplatformterm.js', 'setplatformrole.js', 'removeplatform.js']);

exports.commandSets = [
	generalCommands,
	infoCommands,
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

Object.keys(dictionary).forEach(locale => {
	for (const file of commandFiles) {
		const command = require(`./${file}`);
		getString(locale, file.slice(0, -3), "names").forEach(alias => {
			let searchableAlias = alias.toLowerCase();
			if (commandDictionary[searchableAlias]) {
				// Set locale to null (so that the command handling defaults to guild locale)
				commandDictionary[searchableAlias] = Object.create(command, {
					locale: {
						value: null
					}
				});
			} else {
				// Add overload to command dictionary
				commandDictionary[searchableAlias] = Object.create(command, {
					locale: {
						value: locale
					}
				})
			}
		})
	}
})

exports.commandDictionary = commandDictionary;
