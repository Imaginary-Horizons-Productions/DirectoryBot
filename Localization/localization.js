let supportedLocales = ['en_US.json'];

const localesFiles = fs.readdirSync('./Localization').filter(file => supportedLocales.includes(file));
let dictionary = {};

for (const file of localesFiles) {
	// Ending slice at -5 removes leaves just locale without file extension
	dictionary[file.slice(0, -5)] = require(`./${file}`);
}

exports.getString = function (property, locale) {
	if (dictionary[locale]) {
		// If locale is supported, continue
		if (dictionary[locale][property]) {
			// If property exists, return it
			return dictionary[locale][property];
		} else {
			// If property does not exist, provide en_US and solicit localization help
			return dictionary.en_US[property] + `\nLocalization for the above message is missing. You can contribute it here: https://github.com/Imaginary-Horizons-Productions/DirectoryBot `;
		}
	} else {
		// If locale is not supported, assume property exists for en_US
		return dictionary.en_US[property];
	}
}