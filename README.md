# DirectoryBot
DirectoryBot is a Discord bot that stores friend codes, converts timezones, and announces streams.

## Commands
### convert (time) (timezone1) to (timezone2)
States the (time) in (timezone1) as its equivalent in (timezone2). Assumes sender's timezone if (timezone1) is omitted.

### convert (time) (timezone) for (user)
States the (time) in (timezone1) as its equivalent for (user) based on (user)'s declared timezone. Assumes sender's timezone if (timezone1) is omitted.

### countdown (time) (timezone)
States how long until (time) in (timezone1) for the sender. Returns error message if (timezone) is omitted.

### multistream (user1) (user2)... (layout)
Generates a link to a multistreaming website for the Twitch streams of all (user)s with the specified (layout) based on (user)s' declared streams.

### add (platform) (code)
Stores the sender's (code) for the declared (platform).

### friendcode (user) (platform)
Private messages sender with (user)'s stored code for (platform). Sends all friend codes if (platform) is omitted.

### clear (platform)
Deletes the friend code for the sender in (platform).

### platforms
States a list of platforms currently tracked by DirectoryBot.

## Mod-Only Commands
### newplatform (platform)
Adds a new platform to the list of tracked platforms, allowing users to add their friend codes for that platform.

### removeplatform (platform)
Removes the specified platform from the list of tracked platforms.

### clear (platform) (user)
Deletes the friend code for (user) in (platform).
