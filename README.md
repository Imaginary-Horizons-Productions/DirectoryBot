# DirectoryBot
DirectoryBot is a Discord bot that stores friend codes, converts timezones, and announces streams.

## Set-Up
Add DirectoryBot to your server from this link: https://discordapp.com/api/oauth2/authorize?client_id=585336216262803456&permissions=268437504&scope=bot
### Optional
Use "@DirectoryBot setoprole (role)" to set up an operator role. Operators are allowed to use the operator commands without Discord administrator permissions.

## Commands
#### @DirectoryBot **help**
Lists commands and summaries of their functions.

#### @DirectoryBot **help** (command)
Explains the function and syntax for (command).

#### @DirectoryBot **record** (platform) (information)
Stores the sender's (information) for the declared (platform).

#### @DirectoryBot **lookup** (user) (platform)
Private messages sender with (user)'s stored information for (platform).

#### @DirectoryBot **lookup** (platform)
Private messages sender with everyone's stored information for (platform).

#### @DirectoryBot **delete** (platform)
Deletes the information for the sender in (platform).

#### @DirectoryBot **platforms**
States a list of platforms currently tracked by DirectoryBot.

#### @DirectoryBot **credits**
Lists version info and contributors.

### Time Module
#### @DirectoryBot **convert** (time) **in** (timezone1) **to** (timezone2)
States the (time) in (timezone1) as its equivalent in (timezone2). Assumes sender's timezone if (timezone1) is omitted.

#### @DirectoryBot **convert** (time) **in** (timezone) **for** (user)
States the (time) in (timezone1) as its equivalent for (user) based on (user)'s declared timezone. Assumes sender's timezone if (timezone) is omitted.

#### @DirectoryBot **countdown** (time) **in** (timezone)
States how long until (time) in (timezone1) for the sender.

### Twitch Module
#### @DirectoryBot **multistream** (user1) (user2)... (layout)
Generates a multistre.am link for all (user)s based on the users' recorded Twitch accounts with the specified (layout).

### Operator Commands
#### @DirectoryBot **setoprole** (role)
Sets the operator role for DirectoryBot. Users with that role can use the operator commands without Discord administrator privileges.

#### @DirectoryBot **newplatform** (platform)
Adds (platform) to the list of tracked platforms, allowing users to add their information for that platform.

#### @DirectoryBot **removeplatform** (platform)
Removes (platform) from the list of tracked platforms.

#### @DirectoryBot **setplatformrole** (platform) (role)
Associates (role) with (platform) so that whenever a user adds information for (platform), they'll be given (role) automatically.

#### @DirectoryBot **delete** (platform) (user)
Deletes the friend code for (user) in (platform).
