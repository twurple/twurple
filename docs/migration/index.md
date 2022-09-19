## Make sure your Node version is new enough

Node versions below v12.11 are not supported by Twurple.
Please make sure you're at least on this version - anything older than the v12.x branch is out of support anyway.

## Install and import new packages

The packages were moved to a new NPM scope named `@twurple`. Here's the old and new packages for comparison:

| Old                             | New                       |
| ------------------------------- | ------------------------- |
| `easy-twitch-bot`               | `@twurple/easy-bot`       |
| `twitch`                        | `@twurple/api`            |
| `twitch-api-call`               | `@twurple/api-call`       |
| `twitch-auth`                   | `@twurple/auth`           |
| `twitch-auth-tmi`               | `@twurple/auth-tmi`       |
| `twitch-chat-client`            | `@twurple/chat`           |
| `twitch-common`                 | `@twurple/common`         |
| `twitch-electron-auth-provider` | `@twurple/auth-electron`  |
| `twitch-eventsub`               | `@twurple/eventsub`       |
| `twitch-eventsub-ngrok`         | `@twurple/eventsub-ngrok` |
| `twitch-pubsub-client`          | `@twurple/pubsub`         |
| `twitch-webhooks`               | *removed*                 |
| `twitch-webhooks-ngrok`         | *removed*                 |

## Switch from Kraken to Helix

The namespace `.kraken` was completely removed from the {@link ApiClient}.
Please migrate to the respective Helix counterparts.

## Switch from WebHooks to EventSub

The legacy WebHooks product was deprecated by Twitch and is going to be removed on September 16th.

The `@twurple/eventsub` package is very similar in usage to the old `twitch-webhooks` package.
Please check the [documentation on EventSub](/docs/getting-data/eventsub/listener-setup) for further information.

## Replace default imports with named imports

Default exports have been deprecated in 4.2 from all packages that had them. Their named counterparts have been added
at the same time and the docs have been encouraging their use ever since.

If your code was written for Twitch.js version 4.1 or lower, you might still have these default imports in your code,
and it's time to replace them now, as they're being removed.

```ts diff -1-3 +4-6
import ApiClient from 'twitch';
import ChatClient from 'twitch-chat-client';
import PubSubClient from 'twitch-pubsub-client';
import { ApiClient } from '@twurple/api';
import { ChatClient } from '@twurple/chat';
import { PubSubClient } from '@twurple/pubsub';
```

## Move all {@link EventSubListener} constructor parameters into the options object

To be more consistent with other classes in the package family,
the properties `apiClient` and `secret` were added to {@link EventSubListenerConfig}.
An object of that type is now the only parameter of the {@link EventSubListener} constructor.

## Replace use of `MiddlewareAdapter` with the new {@link EventSubMiddleware} class

A separate listener and a middleware for an existing listener share a lot of common code. 
Still, but to make better use of their *differences*, the listener class was split and the `MiddlewareAdapter` was in turn removed.
Instead, you can use the new {@link EventSubMiddleware} class to apply a middleware to your existing Express app.

The "old" way and the "new" way are too different, so instead of a complicated diff,
we prefer to just link you to the {@link EventSubMiddleware} documentation for a comprehensive example.

## Clean up your EventSub subscriptions before running the upgraded code for the first time

To be able to add additional endpoints to the EventSub listener (other than events),
the base path of the EventSub event callbacks has changed. 
This means that Twitch will keep trying to access your old callbacks, wasting traffic.
You should clean up your subscriptions in some way, for example by calling the EventSub API:

```ts
apiClient.eventSub.deleteAllSubscriptions();
```

## Use string literals rather than enums

A few types were changes from enums to literal strings. Please make sure you look for these types and replace them with literals:

- `CheermoteBackground`
- `CheermoteScale`
- `CheermoteState`
- `HelixBanEventType`
- `HelixBroadcasterType`
- `HelixModeratorEventType`
- `HelixStreamType`
- `HelixSubscriptionEventType`
- `HelixUserType`
- `TwitchApiCallType`

## Fix camel case capitalization

During the 4.x series, a few classes, interfaces, enums and properties that were named with improper camel case
have been renamed, and the old counterparts were deprecated. Please check your usage of the following properties:

- {@link HelixExtensionTransaction#productSku}} - formerly `productSKU`
- {@link ApiClient#callApi}} - formerly `callAPI`
- {@link ChatClient#addVip}} - formerly `addVIP`
- {@link ChatClient#removeVip}} - formerly `removeVIP`
- {@link ChatClient#getVips}} - formerly `getVIPs`
- {@link TwitchClientCredentials#redirectUri}} - formerly `redirectURI`

## Use the new logger configuration

Previously, a few classes exposed a `logLevel` parameter that allowed you to set the log level directly.

Now, this parameter was replaced with a `logger` parameter everywhere that exposes the full logger configuration.

To facilitate this with your usual level of granularity, please change your code as such:

```ts diff -2 +3-5
const chat = new ChatClient({
	logLevel: 'debug',
	logger: {
		minLevel: 'debug'
	}
});
```

:::warning{title="Easier logger configuration"}

You probably want to check out the new global [logging configuration](/docs/getting-data/logging/configuration) via environment variables.

In most cases, it's much easier to set up.

:::

## Replace `RefreshableAuthProvider` with {@link RefreshingAuthProvider} & make use of the new fully serializable {@link AccessToken} interface

The old `RefreshableAuthProvider` was clunky to use. It was initially intended to make it easy to add refreshing
to any existing {@link AuthProvider} implementation, but that benefit never went past the basic {@link StaticAuthProvider} wrapping.

In turn, it is being removed and replaced by a standalone provider called {@link RefreshingAuthProvider}
which doesn't need to wrap another provider anymore. Its parameters are divided into two parts:

- The static data, i.e. app credentials and refresh callback
- The initial token data, which is just an {@link AccessToken} object

The mentioned {@link AccessToken} was changed from a class to a fully serializable interface. This has two implications:

- On the downside, it loses a few convenience getters like `.isExpired` - use the free-standing functions like {@link accessTokenIsExpired} instead.
- On the upside, you can now just write the data to a file/database/etc. and read it back from there without any manual conversion shenanigans.

```ts diff -1,3-18 +2,19-26
const tokenData = JSON.parse(await fs.readFile('./tokens.json', 'UTF-8'));
const tokenData: AccessToken = JSON.parse(await fs.readFile('./tokens.json', 'UTF-8'));
const auth = new RefreshableAuthProvider(
	new StaticAuthProvider(clientId, tokenData.accessToken),
	{
		clientSecret,
		refreshToken: tokenData.refreshToken,
		expiry: tokenData.expiryTimestamp === null ? null : new Date(tokenData.expiryTimestamp),
		onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
			const newTokenData = {
				accessToken,
				refreshToken,
				expiryTimestamp: expiryDate === null ? null : expiryDate.getTime()
			};
			await fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
		}
	}
);
const auth = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret,
		onRefresh: async newTokenData => await fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
	},
	tokenData
);
```

## Use `AuthProvider`s directly

Previously, {@link ApiClient} exposed a few helper methods to instantiate it with an {@link AuthProvider} created internally.

In order to decouple these components from each other, these helpers were removed. 
Instead, you should now instantiate the providers by yourself.

Additionally, some token related helpers on the {@link ApiClient} have been removed. 
You should call them on the provider directly, or use the free-standing helper functions.
Both the providers and the helpers are now exported from the `@twurple/auth` package.

Examples for the most common use cases:

### Static token (for quick testing)

```ts diff -1 +2-3
const api = await ApiClient.withCredentials(clientId, accessToken);
const authProvider = new StaticAuthProvider(clientId, accessToken);
const api = new ApiClient({ authProvider });
```

### Refreshing token (for continuous access to user data)

```ts diff -1-5 +6-14
const api = await ApiClient.withCredentials(clientId, accessToken, undefined, {
	refreshToken,
	clientSecret,
	onRefresh: newTokenData => { /* refresh callback */ }
});
const authProvider = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret,
		onRefresh: async newTokenData => { /* refresh callback, ATTENTION: new data format */ }
	},
	tokenData
);
const api = new ApiClient({ authProvider });
```

### App access token (for server-to-server requests without scopes)

```ts diff -1 +2-3
const api = ApiClient.withClientCredentials(clientId, clientSecret);
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const api = new ApiClient({ authProvider });
```

## Replace API clients with auth providers and remove usage of helpers in other packages

Similarly to the above, the helper `ChatClient.forTwitchClient` has been removed.
Instead, pass the auth provider to the constructor directly.

As you may also have noticed, the `authProvider` isn't a separate parameter anymore,
but was integrated into the options object.

```ts diff -1-2 +3
const api = new ApiClient({ authProvider });
const chat = ChatClient.forTwitchClient(api);
const chat = new ChatClient({ authProvider });
```

Also, the different PubSub classes now take auth providers instead of API clients.

```ts diff -1-2 +3
const api = new ApiClient({ authProvider });
await pubsub.registerUserListener(api);
await pubsub.registerUserListener(authProvider);
```

## Pass cheermote formatting options directly to the respective methods

It was previously possible to add defaults for displaying cheermotes to the {@link ApiClient}. 
These defaults were removed - now you have to pass all display options
to {@link HelixCheermoteList#getCheermoteDisplayInfo}} and {@link HelixCheermoteList#parseMessage}}
as well as {@link TwitchPrivateMessage#parseEmotesAndBits}}.

## Remove use of the `preAuth` and `initialScopes` properties in {@link ApiConfig}

The properties `preAuth` and `initialScopes` were dangerous,
as they left a dangling promise when constructing an {@link ApiClient}.

They were replaced by the safer method {@link ApiClient#requestScopes}},
which you can call (and more importanly, `await`) by yourself.

## {@link ElectronAuthProvider} now requires at least Electron 9

Electron versions below 9 are way past their support time by now. Please update to a supported version.

## Check your bot type in the {@link ChatClient} instantiation

{@link ChatClient} now applies rate limiting by default.
If your bot is a known or verified bot, it may now use way lower rate limits than it could theoretically use.

Please investigate the properties {@link ChatClientOptions#botLevel} and {@link ChatClientOptions#isAlwaysMod}
to raise them appropriately to your bot status.

## Rename {@link PubSubRedemptionMessage}'s `rewardName` property

The property `rewardName` was renamed to `rewardTitle`
to be consistent with the API and EventSub versions of the same data.
Please update your code accordingly.

## Remove our typos

See, we all make mistakes sometimes. But we fixed them, and we ask you to fix them too (otherwise your code will break).

```ts diff -2 +3
declare const reward: HelixCustomReward;
console.log(reward.propmt);
console.log(reward.prompt);
```

## Update your own {@link AuthProvider} implementation

If you built your own auth provider, its interface now *requires* setting the `tokenType` property
to one of the strings `user` or `app` depending on which type of OAuth token it yields.
You probably want this to be `user`. 

## Update log level passing for {@link BasicPubSubClient}

In the past, it was possible to directly pass a log level to the {@link BasicPubSubClient} constructor.

Now, only the usual logger configuration is valid.

```ts diff -1 +2
new BasicPubSubClient('error')
new BasicPubSubClient({ logger: { minLevel: 'error' } })
```

## Check usage of `setId` in {@link ChatEmote}

The property `setId` was moved from the class {@link ChatEmote} to its new subclass {@link ChatEmoteWithSet} to better reflect
when a `setId` is available and when it isn't. Previously, a `setId` of `-1` was the indicator for a missing set ID. 
Now, instead, you should be aware of which methods return a set and which do not.

## [TypeScript] Check your `callApi` calls

From now on, `callApi` returns `unknown` by default, rather than `any`. This may lead to a lot of compiler errors.

Please specify your return types properly in order to fix them.

Alternatively, you may silence the errors (hopefully temporarily!) by passing `any` as type parameter explicitly.

```ts diff -1 +2
const data = await api.callApi({ url: 'users' });
const data = await api.callApi<any>({ url: 'users' });
```

## [TypeScript] Remove the external port setting from EventSub adapter constructors

The external port settings for various {@link ConnectionAdapter} implementations were removed,
since Twitch requires port 443 externally anyway.

While in regular JavaScript, this will just be silently ignored, it will make the TypeScript compiler fail,
so remove it from your code - it probably didn't work anyway.

## [Deprecation] Remove usage of the `.helix` namespace

The namespace `.helix` has been deprecated. All the Helix sub-namespaces now live directly on the {@link ApiClient}.

```ts diff -1 +2
const me = await api.helix.users.getMe();
const me = await api.users.getMe();
```

## [Deprecation] Use the Helix Chat namespaces instead of the Badges namespace

The Badges namespace is a basically-unofficial part of the Twitch API. 
Since the Helix Chat namespace contains the same functionality, you should use it instead. 
