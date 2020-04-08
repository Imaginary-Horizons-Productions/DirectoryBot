var files = require('./files.json');
const fs = require('fs');
var encrypter = require('crypto-js');

fs.readFile("./../../encryptionKey.txt", 'utf8', (error, keyInput) => {
    if (error) {
        console.log(error);
    } else {
        Object.keys(files).forEach(id => {
            var path = files[id];

            fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    var platformsList = {};
                    Object.assign(platformsList, JSON.parse(encrypter.AES.decrypt(data, keyInput).toString(encrypter.enc.Utf8)));
                    platformsList.possessivepronoun.term = "setting";
                    platformsList.possessivepronoun.description = "The user's possessive pronoun, for use in bot messaging.";
                    platformsList.timezone.term = "default";
                    platformsList.timezone.description = "The user's time zone, for use in time conversions.";
                    platformsList.possessivepronoun.term = "username";
                    platformsList.possessivepronoun.description = "The user's stream username. Currently supported: Twitch";

                    fs.writeFile(path, encrypter.AES.encrypt(JSON.stringify(platformsList), keyInput).toString(), 'utf8', (error) => {
                        if (error) {
                            console.log(error);
                        }
                    })
                }
            })
        })
    }
})