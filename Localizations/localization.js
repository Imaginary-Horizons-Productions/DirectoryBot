const fs = require('fs');

exports.supportedLocales = ['en-US', 'en-GB', 'zh-CN', 'zh-TW', 'cs', 'da', 'nl', 'fr', 'de', 'el', 'hu', 'it', 'ja', 'ko', 'no', 'pl', 'pt-BR', 'ru', 'es-ES', 'sv-SE', 'tr', 'bg', 'uk', 'fi', 'hr', 'ro', 'lt'];

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
				// If property exists, check if array (and empty strings)
				let dataToReturn = exports.dictionary[locale][module][property];
				if (dataToReturn instanceof Array) {
					return exports.dictionary[locale][module][property].map(string => {
						if (string === "") {
							return `Localization for this text is missing. You can contribute it here: https://github.com/Imaginary-Horizons-Productions/DirectoryBot `
						} else {
							return string;
						}
					} );
				} else {
					return exports.dictionary[locale][module][property];
				}				
			} else {
				// If property does not exist, provide en-US and solicit localization help
				return exports.dictionary["en-US"][module][property] + `\nLocalization for the above text is missing. You can contribute it here: https://github.com/Imaginary-Horizons-Productions/DirectoryBot `;
			}
		} else {
			// If module is missing, error
			console.error(`Localization module ${module} is missing from ${locale}.`);
			return `Localization for **${locale} ${module}** is missing. You can contribute it here: https://github.com/Imaginary-Horizons-Productions/DirectoryBot `
		}
	} else {
		// If locale is not supported, assume property exists for en-US
		console.error(`Locale ${locale} is missing.`);
		return exports.dictionary["en-US"][module][property];
	}
}
