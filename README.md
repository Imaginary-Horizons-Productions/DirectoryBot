# DirectoryBot
DirectoryBot is a Discord bot that stores friend codes, converts timezones, and announces streams.

## Set-Up
1. Add DirectoryBot to your server from this link: https://discordapp.com/api/oauth2/authorize?client_id=585336216262803456&permissions=268445696&scope=bot
2. Move the DirectoryBot role above any roles you'd like it to be able to automatically add (new roles get added at the bottom)

### Optional
* Use "@DirectoryBot setoprole (role)" to set up an operator role. Operators are allowed to use the operator commands without Discord administrator permissions.
* Record your information for DirectoryBot's default platforms: time zone, possessive pronoun, and stream.
* Check out BountyBot, another Imaginary Horizons Productions discord bot: (link coming soon)

### Notes
If you leave a server, DirectoryBot will delete all of your data. If you kick DirectoryBot, it will delete everyoe's data.

## Commands
#### help
\
Syntax: `@DirectoryBot help`
\
Lists commands and summaries of their functions.

Syntax: `@DirectoryBot help (command)`
\
Explains the command and provides a syntax example.

#### record
\
Syntax: `@DirectoryBot record (platform) (information)`
\
Stores the sender's (information) for the declared (platform).

#### lookup
\
Syntax: `@DirectoryBot lookup (user) (platform)`
\
Private messages sender with (user)'s stored information for (platform).

Syntax: `@DirectoryBot lookup (platform)`
\
Private messages sender with everyone's stored information for (platform).

#### delete
\
Syntax: `@DirectoryBot delete (platform)`
\
Deletes the information for the sender in (platform).

#### platforms
\
Syntax: `@DirectoryBot platforms`
\
States a list of platforms currently tracked by DirectoryBot.

#### credits
\
Syntax: `@DirectoryBot credits`
\
Lists version info and contributors.

### Time Module
The time module contains commands for converting time zones, which users can store in the default platform "timezone".
#### convert
\
Syntax: `@DirectoryBot convert (time) in (timezone1) to (timezone2)`
\
States the (time) in (timezone1) as its equivalent in (timezone2). Assumes sender's timezone if (timezone1) is omitted.

Syntax: `@DirectoryBot convert (time) in (timezone) for (user)`
\
States the (time) in (timezone1) as its equivalent for (user) based on (user)'s declared timezone. Assumes sender's timezone if (timezone) is omitted.

#### countdown
\
Syntax: `@DirectoryBot countdown (time) in (timezone)`
\
States how long until (time) in (timezone1) for the sender.

### Streaming Module
The streaming module contains commands for supporting live-streamers.
#### multistream
\
Syntax: `@DirectoryBot multistream (list of users) (layout)`
\
Generates a multistre.am link for all (user)s based on the users' recorded Twitch accounts with the specified (layout).

#### shoutout
\
Syntax: `@DirectoryBot shoutout (user)`
\
Posts a link to the user's stream!

### Operator Commands
The following commands can only be used by server members who have Discord administrator privledges or the role determined by **setoprole**.
#### setoprole
\
Syntax: `@DirectoryBot setoprole (role)`
\
Sets the operator role for DirectoryBot. Users with that role can use the operator commands without Discord administrator privileges. If no role is given, the op role will be cleared.

#### newplatform
\
Syntax `@DirectoryBot newplatform (platform)`
\
Adds (platform) to the list of tracked platforms, allowing users to add their information for that platform.

#### changeplatformterm
\
Syntax: `@DirectoryBot changeplatformterm (platform) (term)`
\
Changes what DirectoryBot calls information from the given platform (default is "username").

#### removeplatform
\
Syntax: `@DirectoryBot removeplatform (platform)`
\
Removes (platform) from the list of tracked platforms.

#### setplatformrole
Syntax: `@DirectoryBot setplatformrole (platform) (role)`
\
Associates (role) with (platform) so that whenever a user adds information for (platform), they'll be given (role) automatically.

#### delete (for other users)
Syntax: `@DirectoryBot delete (platform) (user)`
\
Deletes the friend code for (user) in (platform).
