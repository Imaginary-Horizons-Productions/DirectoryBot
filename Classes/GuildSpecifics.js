const PlatformData = require('./PlatformData.js');

module.exports = class GuildSpecifics {
	constructor(userDictionaryInput = {}, platformsListInput = {
		"possessivepronoun": new PlatformData("setting", "The user's possessive pronoun, for use in bot messaging."),
		"timezone": new PlatformData("default", "The user's time zone, for use in time conversions."),
		"stream": new PlatformData(undefined, "The user's stream username. Currently supported: Twitch")
	}, managerRoleInput = "", permissionsRoleInput = "", infoLifetimeInput = 3600000) {
		this.userDictionary = userDictionaryInput;
		this.platformsList = platformsListInput;
		this.managerRoleID = managerRoleInput;
		this.permissionsRoleID = permissionsRoleInput;
		this.infoLifetime = infoLifetimeInput;
		this.expiringMessages = {};
		this.blockDictionary = {};
		this.welcomeMessage = "";
	}
}
