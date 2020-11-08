const fs = require('fs');
const { exec } = require('child_process');
var consoleArgs = process.argv.slice(2);

// Backup server data
fs.readFile(`encryptionKey.txt`, `utf8`, (error, keyInput) => {
    if (error) {
        console.log(error);
    } else {
        fs.readFile("guildsList.txt", 'utf8', (error, guildsListInput) => {
            if (error) {
                console.log(error);
            }
            const guildIDs = Object.keys(JSON.parse(encrypter.AES.decrypt(guildsListInput, keyInput).toString(encrypter.enc.Utf8)));
            guildIDs.forEach(guildID => {
                ['managerRole.txt', 'permissionsRole.txt', 'platformsList.txt', 'blockDictionary.txt', 'infoLifetime.txt'].forEach(fileName => {
                    fs.copyFile(`./data/${guildID}/${fileName}`, `./backups/${guildID}/${Date.now()}_${fileName}`, error => {
                        if (error) {
                            console.error(error);
                        }
                    });
                });
            })
        });
    }
})

// Esure that all packages at the expected version
exec('npm install', (error, stdout, stderr) => {
    if (error) {
        console.log(`Error during package update: ${error.message}`);
    }
    if (stderr) {
        console.log(`Console stderr during package update: ${stderr}`);
    }
    if (error || stderr) {
        return;
    }
    console.log(`Results of npm install:\n${stdout}`);
});

// Find and run all migrations
if (consoleArgs[0]) {
    var migrationPattern = new RegExp(`${consoleArgs[0]}_m\\d+_`);
    fs.readdir(`./Migrations`, (error, files) => {
        if (error) {
            console.log(`error in reading migration directory: ${error.message}`);
        } else {
            migrationFolders = files.filter(f => migrationPattern.test(f));
            console.log(`Found the following migrations for the current version ${consoleArgs[0]}:\n${migrationFolders.join(', ')}`);
            migrationFolders.forEach(async migration => await runMigration(migration, guilds));
        }
    });
}

// Enable verison notes announcement
let versionNotesPath = `./versionMetadata.json`;
fs.readFile(versionNotesPath, 'utf8', (error, data) => {
    if (error) {
        console.log(error);
    } else {
        let versionMetadata = {};
        Object.assign(versionMetadata, JSON.parse(data));
        versionMetadata.showVersion = true;
        fs.writeFile(versionNotesPath, JSON.stringify(versionMetadata), 'utf8', (error) => {
            if (error) {
                console.log(error);
            }
            console.log(`Version notes announcement enabled`);
        })
    }
})

function runMigration(migrationName, guilds) {
	var path = `./Migrations/${migrationName}`;
	return exec(`node fixer.js ${guilds.join(' ')}`, { cwd: path }, (error, stdout, stderr) => {
		if (error) {
			console.log(`Error on ${migrationName}:\n${error.message}`);
		}
		if (stderr) {
			console.log(`Console stderr on ${migrationName}:\n${stderr}`);
		}
		if (error || stderr) {
			return;
		}
		console.log(`Migration ${migrationName} output:\n${stdout}`);
	});
}
