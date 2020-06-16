const fs = require('fs');

// Each filename array may contain a maximum of 25 commands to conform with MessageEmbed limit of 25 fields
// General Commands: 12
// Time Zone Commands: 2
// Stream Commands: 2
// Configuration Commands: 6
exports.commandList = {
    "General Commands": ['help.js', 'record.js', 'import.js', 'send.js', 'lookup.js','myentries.js', 'whois.js', 'delete.js', 'block.js', 'platforms.js', 'support.js', 'credits.js'],
    "Time Zone Commands": ['convert.js', 'countdown.js'],
    "Stream Commands": ['multistream.js', 'shoutout.js'],
    "Configuration Commands": ['permissionsrole.js', 'managerrole.js', 'newplatform.js', 'setplatformterm.js', 'setplatformrole.js', 'removeplatform.js']
};

var commandFileNames = [];
Object.values(this.commandList).forEach(array => {
    commandFileNames = commandFileNames.concat(array);
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
