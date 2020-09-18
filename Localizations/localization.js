const fs = require('fs');

exports.supportedLocales = ['en_US'];

const localesFiles = fs.readdirSync('./Localizations').filter(file => exports.supportedLocales.includes(file.slice(0, -5)));
exports.dictionary = {};

for (const file of localesFiles) {
	exports.dictionary[file.slice(0,-5)] = require(`./${file}`);
}

exports.getString = function (locale, module, property) {
	if (exports.dictionary[locale]) {
		// If locale is supported, continue
		if (exports.dictionary[locale][module]) {
			// If module exists, continue
			if (exports.dictionary[locale][module][property]) {
				// If property exists, return it
				return exports.dictionary[locale][module][property];
			} else {
				// If property does not exist, provide en_US and solicit localization help
				return exports.dictionary.en_US[module][property] + `\nLocalization for the above message is missing. You can contribute it here: https://github.com/Imaginary-Horizons-Productions/DirectoryBot `;
			}
		} else {
			// If module is missing, error
			console.error(`Localization module ${module} is missing from ${locale}.`)
		}
	} else {
		// If locale is not supported, assume property exists for en_US
		return exports.dictionary.en_US[module][property];
	}
}
