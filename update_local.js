const fs = require('fs');
const { exec } = require('child_process');
const { getString } = require('./Localizations/localization.js');
const { commandSets } = require('./Commands/CommandsList.js');

// Update package.js
exec('npm update');

// Update README.md
let text = `# DirectoryBot
DirectoryBot is a configurable, multi-language bot that stores friend codes and converts timezones.

## Set-Up
1. Add DirectoryBot to your server from this link: https://discord.com/api/oauth2/authorize?client_id=585336216262803456&permissions=27648&scope=bot
2. Move the DirectoryBot role above any roles you'd like it to be able to automatically add (new roles get added at the bottom)

### Optional
* Use "@DirectoryBot setpermissionsrole (role)" to store the permissions role. This allows the bot to interpret accidental mentions of the role as command messages.
* Record your information for DirectoryBot's default platforms: time zone, possessive pronoun, and stream.
* Check out the Imaginary Horizons Productions Patreon: https://www.patreon.com/imaginaryhorizonsproductions

### Notes
If you leave a server, DirectoryBot will delete all of your data. If you kick DirectoryBot, it will delete everyone's data.

`;

commandSets.forEach(commandSet => {
	text += `## ${getString("en-US", commandSet.module, "title")}\n${getString("en-US", commandSet.module, "description")}\n`;
	commandSet.fileNames.forEach(filename => {
		const command = filename.slice(0, -3);
		text += `### ${getString("en-US", command, "names").join(', ')}\n${getString("en-US", command, "description")}\n`;
		let headers = getString("en-US", command, "headers");
		let texts = getString("en-US", command, "texts");
		for (var i = 0; i < headers.length; i++) {
			text += `#### ${headers[i]}\n${texts[i]}\n`;
		}
		text += '\n';
	})
})

fs.writeFile('./README.md', text, (error) => {
	if (error) {
		console.log(error);
	}
});
