var files = require('./files.json');
const fs = require('fs');
var encrypter = require('crypto-js');

fs.readFile("./../../encryptionKey.txt", 'utf8', (error, keyInput) => {
    if (error) {
        console.log(error);
    } else {
        fs.readFile("guildsList.txt", 'utf8', (error, guildsListInput) => {
            if (error) {
                console.log(error);
            } else {
                let guildIDList = JSON.parse(encrypter.AES.decrypt(guildsListInput, keyInput).toString(encrypter.enc.Utf8))["list"];
                var platformsList = {};
                guildIDList.forEach(guildID => {
                    platformsList[guildID] = "en_US";
                });
            }

            fs.writeFile("guildsList.txt", encrypter.AES.encrypt(JSON.stringify(platformsList), keyInput).toString(), 'utf8', (error) => {
                if (error) {
                    console.log(error);
                }
            })
        })
    }
})