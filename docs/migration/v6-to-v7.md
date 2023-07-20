## Make sure legacy secrets are not used anymore

Support for legacy secrets was removed in v7. If you're using v6 with the `legacySecrets: true` flag on,
you have two options to mitigate this:

### The easy (but downtime-incurring) way

This should only be done if you have just a few subscriptions (a maximum of about 50-100).  
**Both of these steps will take a while and cause downtime for your application.**

1. Run `apiClient.eventSub.deleteAllSubscriptions()` once.  
   (Do not keep it in the code that runs on every start of your applications.)
2. Deploy a new version of your application with the `legacySecrets` config option removed, and ignore the warning.

### The hard (but smooth) way

If you do this correctly, this will _not_ cause any downtime
other than the time necessary for the restarts/deployments themselves,
even though the last step is the same as in the other process.

1. Change the configuration to `legacySecrets: 'migrate'`.
2. On every single subscription object you created, call the `.migrate()` method.  
   This does not have to be done all at once and can be done at your own pace,
   but **make sure the application does not go down before calling this on *every* subscription.**
   Otherwise, you will have to switch to the other method,
   as it is impossible to find out which subscriptions have already been migrated.
3. After all subscriptions have been migrated,
   deploy a new version of your application with the `legacySecrets` config option removed, and ignore the warning.

## Remove auth-electron package

The `auth-electron` package was removed, as Twitch does not support embedding their login page in Electron anymore.  
There is no direct replacement for this. You need to implement some kind of communication channel
between your application and the browser instead.

## Update all packages to the same version

Make sure that all Twurple packages are up-to-date and on the same version.

On a unix-like system with the `jq` utility installed, you can use one of these handy one-liners for that:

	# for yarn
	jq -r '.dependencies | keys[] | select(. | startswith("@twurple/"))' package.json | xargs yarn add
	# for npm
	jq -r '.dependencies | keys[] | select(. | startswith("@twurple/"))' package.json | xargs printf '%s@latest\n' | xargs npm install --save

## Remove/replace moderator & client ID parameters

Many methods used `moderator` parameters to select the authenticated user from the `AuthProvider` to call an endpoint with.
This was removed, and you can now either directly use the broadcaster as context
or use the `asUser` or `asIntent` methods on the {@link ApiClient} to override the context.

```ts diff -1 +2
await apiClient.moderation.deleteChatMessages(broadcaster, broadcaster, messageId);
await apiClient.moderation.deleteChatMessages(broadcaster, messageId);
```

```ts diff -1 +2-5
await apiClient.moderation.deleteChatMessages(broadcaster, moderator, messageId);
await apiClient.asUser(
	moderator,
	async ctx => await ctx.moderation.deleteChatMessages(broadcaster, messageId)
)
```

This applies to the following methods:

- {@link HelixChannelApi#getChannelFollowers}, {@link HelixChannelApi#getChannelFollowersPaginated}
- {@link HelixChatApi#getChatters}, {@link HelixChatApi#getChattersPaginated}
- {@link HelixChatApi#getSettingsPrivileged}, {@link HelixChatApi#updateSettings}
- {@link HelixChatApi#sendAnnouncement}
- {@link HelixChatApi#shoutoutUser}
- {@link HelixEventSubApi#subscribeToChannelFollowEvents}, {@link HelixEventSubApi#subscribeToChannelShieldModeBeginEvents}, {@link HelixEventSubApi#subscribeToChannelShieldModeEndEvents}, {@link HelixEventSubApi#subscribeToChannelShoutoutCreateEvents}, {@link HelixEventSubApi#subscribeToChannelShoutoutReceiveEvents}
- {@link HelixModerationApi#getAutoModSettings}, {@link HelixModerationApi#updateAutoModSettings}
- {@link HelixModerationApi#banUser}, {@link HelixModerationApi#unbanUser}
- {@link HelixModerationApi#getBlockedTerms}, {@link HelixModerationApi#addBlockedTerm}, {@link HelixModerationApi#removeBlockedTerm}
- {@link HelixModerationApi#deleteChatMessages}
- {@link HelixModerationApi#getShieldModeStatus}, {@link HelixModerationApi#updateShieldModeStatus}

Similarly, the following methods have been changed to not require to pass the client ID explicitly anymore,
as it's already provided by your `AuthProvider` instance:

- {@link EventSubListener#onExtensionBitsTransactionCreate}
- {@link EventSubListener#onUserAuthorizationGrant}
- {@link EventSubListener#onUserAuthorizationRevoke}

## Check authentication requirements for `HelixUser` subscription and follower shortcuts

The {@link HelixUser} class has some shortcuts to determine subscriber status.
The already existing methods switched from broadcaster authentication to user subscription
to have their names and `this` context make more sense, and new methods for broadcaster context were added.

Similarly, the follower methods were changed to use the new authenticated follower APIs,
as the unauthenticated versions will be shut down by Twitch soon.

Check the documentation of the {@link HelixUser} class for more information.

## Change event listener options in {@link RefreshingAuthProvider} to method calls

The `onRefresh` and `onRefreshFailure` config options from {@link RefreshingAuthProvider} have been removed
in favor of event listener methods of the same name. This was done to be in line with all other event listener methods.

```ts diff -4 +6
const authProvider = new RefreshingAuthProvider({
	clientId,
	clientSecret,
	onRefresh: async (userId, newTokenData) => await fs.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8'),
});
authProvider.onRefresh(async (userId, newTokenData) => await fs.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8'));
```

## Update emote & cheermote parsing

The methods `parseEmotes` and `parseEmotesAndBits` were removed from the {@link ChatMessage} class.
The function {@link parseChatMessage} replaces both of these.

```ts diff -2 +3
chatClient.onMessage((channel, user, text, msg) => {
	const parts = msg.parseEmotes();
	const parts = parseChatMessage(text, msg.emoteOffsets);
  // more code
});
```

The function accepts a cheermote list as an optional third parameter,
but rather than taking an array of full objects like `parseEmotesAndBits` took, it takes just an array of names.  
The format parameter was completely removed,
as the cheermote can be formatted by calling the {@link HelixCheermoteList#getCheermoteDisplayInfo} method
on the instance you have already fetched for getting the list of names.

```ts diff -3 +4
chatClient.onMessage(async (channel, user, text, msg) => {
	const cheermotes = await apiClient.bits.getCheermotes(msg.userInfo.userId);
	const parts = msg.parseEmotesAndBits(cheermotes, { background, state, scale });
	const parts = parseChatMessage(text, msg.emoteOffsets, cheermotes.getPossibleNames());
	// more code
});
```

## Update error handling

When authentication and token refreshing fails, {@link RefreshingAuthProvider} will now cache that failure.
This results means that attempts to use authentication for the users that failed
will now throw a {@link CachedRefreshFailureError} instead of a variety of other errors that could happen when trying to refresh.

## Take care about {@link ChatClient} `Promise` handling

The {@link ChatClient} methods `connect` and `reconnect` have been changed to be synchronous.
If you have been using `.then()` to handle the promises returned by these methods, you should change this.
`await` will not break, but is useless now.

## Remove special channel name handling for chat events

All chat events now internally remove the leading `#` from the channel name.
If you previously used naive methods like `channel.slice(1)` to cut it off, you should remove that.
The utility method {@link toUserName} from the `@twurple/chat` package is not as naive, but effectively useless now.

## Apply other minor renames

A few things were renamed for clarity.

| Old                | New                       |
|--------------------|---------------------------|
| `PrivateMessage`   | `ChatMessage`             |
| `ChatClient#onR9k` | `ChatClient#onUniqueChat` |

## Make platform specific fetch options available to your API calls

In order to pass specific options like proxy credentials to your API calls,
you must now augment the {@link TwitchApiCallFetchOptions} interface from the `@twurple/api-call` package.
Its reference entry will show you the most common cases.
