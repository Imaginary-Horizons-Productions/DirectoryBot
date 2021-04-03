# DirectoryBot
DirectoryBot is a configurable, multi-language bot that stores friend codes and converts timezones.

## Set-Up
1. Add DirectoryBot to your server from this link: https://discord.com/api/oauth2/authorize?client_id=585336216262803456&permissions=27648&scope=bot
2. Move the DirectoryBot role above any roles you'd like it to be able to automatically add (new roles get added at the bottom)

### Optional
* Use "@DirectoryBot setpermissionsrole (role)" to store the permissions role. This allows the bot to interpret accidental mentions of the role as command messages.
* Record your information for DirectoryBot's default platforms: time zone, possessive pronoun, and stream.
* Check out the Imaginary Horizons Productions Patreon: https://www.patreon.com/imaginaryhorizonsproductions

### Notes
If you leave a server, DirectoryBot will delete all of your data. If you kick DirectoryBot, it will delete everyone's data.

## General Commands
To interact with DirectoryBot, mention the bot then type one of these commands:
### Record, Log, Add
This command adds your information for given platform so people can ask the bot for it.
#### Recording data
`@DirectoryBot record (platform) (data)`
The message containing the command will be deleted for security purposes. Discord's spoilers markdown (|| on both sides) is removed from code entry to allow hiding entry from mobile via spoilers markdown.

### Import
This command copies your data for matching platforms from a given server.
#### Importing data
`@DirectoryBot import (channel mention or snowflake from source server)`
There are two ways to indicate which server to import from: by mentioning a channel from that server, or by providing the server's snowflake.

To get a channel mention, start a message in the server you want to import from. Start with #, then autocomplete. You can then copy-paste the blue link into your command in the destination server.

To get a server's snowflake, first activate Developer Mode in your User Settings. Then you can right-click on the source server and select "Copy ID" from the drop-down menu.

### Tell, Send
This command sends your information on the given platform to the given user.
#### Tell someone your data
`@DirectoryBot tell (platform) (user)`

### Lookup
This command messages you the entries a given platform. You can limit your results to a set of users by mentioning them at the end of the command.
#### Look up a platform
`@DirectoryBot lookup (platform)`
#### Filter for users
`@DirectoryBot lookup (platform) (users)`

### MyData, MyEntries
This command sends you a private message with all the information you've recorded.
#### Usage
`@DirectoryBot mydata`

### WhoIs
This command checks if anyone uses the given username and private messages you the result.
#### Look up a username
`@DirectoryBot whois (username)`

### Delete, Remove, Clear
This command removes your data for the given platform. Bot managers can use this command to remove information for other users.
#### Delete your data
`@DirectoryBot delete (platform)`
#### Delete another user's data
`@DirectoryBot delete (user) (platform)`

### Block
This command prevents the mentioned user from accessing your data. Unblock a user by using it on the user again.
#### Block a user
`@DirectoryBot block (user)`
#### Unblock a user
`@DirectoryBot block (user)`

### Platforms
This command lists the games/services DirectoryBot can be used to record or retrieve information for. Using `help` on this command uses the command.
#### Usage
`@DirectoryBot platforms`

### Raffle
This command generates a list of users including the mentioned users, users with any of the mentioned roles, and users who've recorded data for the mentioned platforms. Then it randomly selects one of those users.
#### Select a user randomly
`@DirectoryBot raffle (list of users, roles, or platforms)`

### Feedback, BugReport, Suggestion, Suggest
This command posts feedback to the Imaginary Horizons Productions test server and provides you an invite to the server.
#### Usage
`@DirectoryBot Feedback (message)`
Using the feedback command as the comment on an attachment can allow you to send a picture or text file with the message.

## Informational Commands
Use these commands to look up information about DirectoryBot.
### GetStarted, Tutorial
This command provides steps for getting started with DirectoryBot.
#### Usage
`@DirectoryBot GetStarted`

### About, Credits, Creditz
This command presents version info and contributors. Using `help` on this command uses the command.
#### Usage
`@DirectoryBot creditz`

### Help, Commands
This command provides details on DirectoryBot commands by either listing all commands available to you, or providing details on a specific command.
#### List all commands
`@DirectoryBot help`
#### Get details on a specific command
`@DirectoryBot help (command)`

### Support
This command lists easy ways to support DirectoryBot development. Using `help` on this command uses the command.
#### Usage
`@DirectoryBot support`

### DataPolicy, PrivacyPolicy
This command tells you the types of information DirectoryBot collects and how it uses it.
#### Usage
`@DirectoryBot DataPolicy

### Version
This command private messages the user with the version notes.
#### Get the Last Patch Notes
`@DirectoryBot version`
#### Get the Full Patch Notes
`@DirectoryBot version full`

## Time Zone Commands
The time module contains commands for converting time zones, which users can store in the default platform "timezone".
### Convert
This command calculates a time for a given user or time zone. DirectoryBot uses [tz database format](https://kevinnovak.github.io/Time-Zone-Picker/) for time zones.
#### Convert a time to a user's time zone
`@DirectoryBot convert (time) in (start time zone) for (user)`
Converting time zones for users is not available via private messages.
#### Convert a time to a specified time zone
`@DirectoryBot convert (time) in (start time zone) to (result time zone)`
#### ​
If the starting timezone is omitted, the conversion will be attempted with the time zone you've recorded for the "timezone" platform.

### Countdown
This command calculates the amount of time until a given time. DirectoryBot uses [tz database format](https://kevinnovak.github.io/Time-Zone-Picker/) for time zones.
#### Count down to a time
`@DirectoryBot countdown (time) in (time zone)`
If the time zone is omitted, the countdown will be attempted with the time zone you've recorded for the "timezone" platform, then the server's local time zone failing that.

## Stream Commands
The streaming module contains commands for supporting live-streamers.
### Multistream, Multitwitch
This command generates a link to watch multiple streams simultaneously. Optionally, you can enter the layout number last if you want to specify that.
#### Generate multistream link
`@DirectoryBot multistream (users) (layout)`

### Shoutout, StreamShoutout
This command posts the given user's stream information.
#### Give a stream shoutout
`@DirectoryBot shoutout (user)`

## Configuration Commands
The following commands can only be used by server members who have bot management permission (a role above DirectoryBot).
### PermissionsRole, SetPermissionsRole
This command updates the permissions role. This allows DirectoryBot to interpret accidental mentions of that role as command messages.
#### Set the permissions role
`@DirectoryBot permissionsrole (role)`
#### Clear the permissions role
`@DirectoryBot permissionsrole`

### SetLocale, SetLanguage
This command sets the default locale (language) for the server it is used in (default: en-US).
#### Set the default locale
`@DirectoryBot ${commandAlias} setlocale (locale)`
#### Contributing localization
If you'd like to contribute to localizing, check out our [GitHub](https://github.com/Imaginary-Horizons-Productions/DirectoryBot). Currently supported: ${supportedLocales}

### DataLifetime, InfoLifetime
This command sets the number of hours before responses from the `lookup` and `send` commands expire (decimals allowed).
#### Set the data lifetime
`@DirectoryBot datalifetime (number of hours)`

### NewPlatform, AddPlatform
This command sets up a new game/service for users to record and retrieve information.
#### Create a new platform
`@DirectoryBot newplatform (platform name) (information term) (description)`
Information term and description are optional, though providing a description without a information term will result in the first word of the description being interpreted as the information term. Information term defaults to "username". The role mentioned in the command will be set as the platform's role.

### SetPlatformTerm, ChangePlatformTerm
This command changes what DirectoryBot calls data for the given platform (default is "username").
#### Change a platform's data term
`@DirectoryBot setplatformterm (platform) (data term)`

### SetPlatformRole
This command associates the given role and platform. Anyone who records information for that platform will be automatically given the associated role. Using the command without mentioning a role clears the set role for the platform.
#### Set a platform role
`@DirectoryBot setplatformrole (platform) (role)`
#### Clear a platform role
`@DirectoryBot setplatformrole (platform)`

### RemovePlatform
This command removes a platform from DirectoryBot's list of platforms for the server.
#### Remove a platform
`@DirectoryBot removeplatform (platform)`

