Getting data from the Twitch API is sadly split into many systems. Here's some handy tables on which library you can and
should use for which use case.

## Current state & actions

| Operation                                     | `@twurple/api` | `@twurple/chat`                                        |
|-----------------------------------------------|----------------|--------------------------------------------------------|
| Start an ad                                   | Yes            | No                                                     |
| Get Bits leaderboard                          | Yes            | No                                                     |
| Get available Cheermotes                      | Yes            | No                                                     |
| Get Extension transactions                    | Yes            | No                                                     |
| Get channel category/title                    | Yes            | No                                                     |
| Set channel category/title                    | Yes            | No                                                     |
| Get channel editors                           | Yes            | No                                                     |
| Manage custom rewards & redemptions           | Yes            | No                                                     |
| Get available emotes & badges                 | Yes            | No                                                     |
| Get & create clips                            | Yes            | No                                                     |
| Manage drops                                  | Yes            | No                                                     |
| Manage extensions                             | Yes            | No                                                     |
| Get category info                             | Yes            | No                                                     |
| Manage polls & predictions                    | Yes            | No                                                     |
| Get banned users                              | Yes            | No                                                     |
| Ban/unban/timeout users                       | Yes            | No                                                     |
| Get & manage schedules                        | Yes            | No                                                     |
| Search categories                             | Yes            | No                                                     |
| Search channels                               | Yes            | No                                                     |
| Get stream key                                | Yes            | No                                                     |
| Get info about streams                        | Yes            | No                                                     |
| Manage stream markers                         | Yes            | No                                                     |
| Get list of subscribers                       | Yes            | No                                                     |
| Check subscription                            | Yes            | Yes (in message context)                               |
| Get list of VIPs                              | Yes            | No                                                     |
| Check VIP                                     | Yes            | Yes (in message context)                               |
| Manage VIPs                                   | Yes            | No                                                     |
| Get list of moderators                        | Yes            | No                                                     |
| Manage moderators                             | Yes            | No                                                     |
| Get & manage stream tags                      | Yes            | No                                                     |
| Get team info                                 | Yes            | No                                                     |
| Get user info                                 | Yes            | Yes (in message context; login, display name, ID only) |
| Get & manage follows                          | Yes            | No                                                     |
| Get & manage VODs                             | Yes            | No                                                     |
| Raid users                                    | Yes            | No                                                     |
| Send chat messages                            | Yes            | Yes                                                    |
| Send chat announcements                       | Yes            | No                                                     |
| Send whispers                                 | Yes            | No                                                     |
| Remove chat messages                          | Yes            | No                                                     |
| Set chat modes (e.g. emote/sub/follower only) | Yes            | No                                                     |
| Get & manage AutoMod settings                 | Yes            | No                                                     |
| Get current Creator Goals state               | Yes            | No                                                     |
| Get list of chatters                          | Yes            | No                                                     |
| Get info about charity campaigns              | Yes            | No                                                     |
| Get & manage Shield Mode status               | Yes            | No                                                     |

## Events

| Event type                             | `@twurple/chat`              | `@twurple/pubsub`         | `@twurple/eventsub-*`  |
|----------------------------------------|------------------------------|---------------------------|------------------------|
| Chat messages                          | Yes                          | Sub & cheer messages only | Yes                    |
| Chat mode (e.g. sub only) changes      | Yes                          | No                        | Yes                    |
| Whispers                               | Yes                          | Yes                       | No (in beta by Twitch) |
| Cheers                                 | Yes                          | Yes                       | Yes                    |
| Channel points                         | Redemptions w/ messages only | Redemptions only          | Yes                    |
| Subscriptions                          | Published only               | Published only            | Yes                    |
| AutoMod                                | No                           | Yes                       | Yes                    |
| Live / offline / stream changes        | No                           | No                        | Yes                    |
| Follows                                | No                           | No                        | Yes                    |
| Raids                                  | Yes                          | No                        | Yes                    |
| Bans                                   | Yes                          | Yes                       | Yes                    |
| Mod add/remove                         | No                           | Yes                       | Yes                    |
| Polls & predictions                    | No                           | No                        | Yes                    |
| Extension transactions                 | No                           | No                        | Yes                    |
| Hype Trains                            | No                           | No                        | Yes                    |
| Authorization grant/revoke             | No                           | No                        | Yes                    |
| Drops                                  | No                           | No                        | Yes                    |
| Charity campaigns & donations          | No                           | No                        | Yes                    |
| Shield mode begin/end                  | No                           | No                        | Yes                    |
| Unban request approve/deny             | No                           | Yes                       | No (in beta by Twitch) |
| Low-trust users treatment/chat message | No                           | Yes                       | No (in beta by Twitch) |
