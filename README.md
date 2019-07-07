# DirectoryBot
DirectoryBot is a Discord bot that stores friend codes, converts timezones, and announces streams.

## Set-Up
Add DirectoryBot to your server: https://discordapp.com/api/oauth2/authorize?client_id=585336216262803456&permissions=268437504&scope=bot
### Optional
Use "@DirectoryBot setoprole (role)" to set up an operator role

## Commands
#### help
Lists commands and summaries of their functions.

#### help (command)
Explains the function and syntax for (command).

#### record (platform) (information)
Stores the sender's (information) for the declared (platform).

#### lookup (user) (platform)
Private messages sender with (user)'s stored information for (platform).

#### lookup (platform)
Private messages sender with everyone's stored information for (platform).

#### delete (platform)
Deletes the information for the sender in (platform).

#### platforms
States a list of platforms currently tracked by DirectoryBot.

#### credits
Lists version info and contributors.

### Time Module
#### convert (time) in (timezone1) to (timezone2)
States the (time) in (timezone1) as its equivalent in (timezone2). Assumes sender's timezone if (timezone1) is omitted.

### convert (time) in (timezone) for (user)
States the (time) in (timezone1) as its equivalent for (user) based on (user)'s declared timezone. Assumes sender's timezone if (timezone) is omitted.

### countdown (time) in (timezone)
States how long until (time) in (timezone1) for the sender.

###Twitch Module
#### multistream (user1) (user2)... (layout)
Generates a multistre.am link for all (user)s based on the users' recorded Twitch accounts with the specified (layout).

### Operator Commands
#### setoprole (role)
Sets the operator role for DirectoryBot. Users with that role can use the operator commands without Discord administrator privileges.

#### newplatform (platform)
Adds (platform) to the list of tracked platforms, allowing users to add their information for that platform.

#### removeplatform (platform)
Removes (platform) from the list of tracked platforms.

#### setplatformrole (platform) (role)
Associates (role) with (platform) so that whenever a user adds information for (platform), they'll be given (role) automatically.

#### delete (platform) (user)
Deletes the friend code for (user) in (platform).
