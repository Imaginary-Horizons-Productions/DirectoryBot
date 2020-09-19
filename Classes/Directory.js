const Platform = require('./Platform.js');
const { getString } = require('./../Localizations/localization.js');

module.exports = class Directory {
	constructor(localeInput = "en-US", userDictionaryInput = {}, platformsListInput = {}, managerRoleInput = "", permissionsRoleInput = "", infoLifetimeInput = 3600000) {
		this.locale = localeInput;
		this.userDictionary = userDictionaryInput;
		this.platformsList = platformsListInput;
		this.platformsList[getString(localeInput, "platformPossessivePronoun", "token")] = new Platform(getString(localeInput, "platformPossessivePronoun", "term"), getString(localeInput, "platformPossessivePronoun", "description"));
		this.platformsList[getString(localeInput, "platformTimeZone", "token")] = new Platform(getString(localeInput, "platformTimeZone", "term"), getString(localeInput, "platformTimeZone", "description"));
		this.platformsList[getString(localeInput, "platformStream", "token")] = new Platform(getString(localeInput, "platformStream", "term"), getString(localeInput, "platformStream", "description"));
		this.managerRoleID = managerRoleInput;
		this.permissionsRoleID = permissionsRoleInput;
		this.infoLifetime = infoLifetimeInput;
		this.expiringMessages = {};
		this.blockDictionary = {};
	}
}
