const Platform = require('./Platform.js');

module.exports = class Directory {
	constructor(localeInput = "en_US", userDictionaryInput = {}, platformsListInput = {
		"possessivepronoun": new Platform("setting", "The user's possessive pronoun, for use in bot messaging."),
		"timezone": new Platform("default", "The user's time zone, for use in time conversions."),
		"stream": new Platform(undefined, "The user's stream username. Currently supported: Twitch")
	}, managerRoleInput = "", permissionsRoleInput = "", infoLifetimeInput = 3600000) {
		this.locale = localeInput;
		this.userDictionary = userDictionaryInput;
		this.platformsList = platformsListInput;
		this.managerRoleID = managerRoleInput;
		this.permissionsRoleID = permissionsRoleInput;
		this.infoLifetime = infoLifetimeInput;
		this.expiringMessages = {};
		this.blockDictionary = {};
	}
}
