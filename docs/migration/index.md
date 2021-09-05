:::warning{title="Incomplete"}

This migration guide is currently a work in progress and not expected to be complete.  
It's still missing some crucial migration steps.

:::

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

The namespace `.kraken` was completely removed from the {@ApiClient}.
Please migrate to the respective Helix counterparts.

## (Deprecation) Remove usage of the `.helix` namespace

The namespace `.helix` has been deprecated. All the Helix sub-namespaces now live directly on the {@ApiClient}.

```ts diff -1 +2
const me = await api.helix.users.getMe();
const me = await api.users.getMe();
```

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

## Fix camel case capitalization

During the 4.x series, a few classes, interfaces, enums and properties that were named with improper camel case
have been renamed, and the old counterparts were deprecated. Please check your usage of the following properties:

- {@HelixExtensionTransaction#productSku} - formerly `productSKU`
- {@ApiClient#callApi} - formerly `callAPI`
- {@ChatClient#addVip} - formerly `addVIP`
- {@ChatClient#removeVip} - formerly `removeVIP`
- {@ChatClient#getVips} - formerly `getVIPs`
- {@TwitchClientCredentials#redirectUri} - formerly `redirectURI`

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

You probably want to check out the new global logging configuration via environment variables.
(TODO link this to new page)

In most cases, it's much easier to set up.

:::

## Use `AuthProvider`s directly

Previously, {@ApiClient} exposed a few helper methods to instantiate it with an {@AuthProvider} created internally.

In order to decouble these components from each other, these helpers were removed. 
Instead, you should now instantiate the providers by yourself.

Additionally, some token related helpers on the {@ApiClient} have been removed. 
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

It was previously possible to add defaults for displaying cheermotes to the {@ApiClient}. 
These defaults were removed - now you have to pass all display options to {@HelixCheermoteList#getCheermoteDisplayInfo}.

## Remove use of the `preAuth` and `initialScopes` properties in {@ApiConfig}

The properties `preAuth` and `initialScopes` were dangerous,
as they left a dangling promise when constructing an {@ApiClient}.

They were replaced by the safer method {@ApiClient#requestScopes},
which you can call (and more importanly, `await`) by yourself.

## {@ElectronAuthProvider} now requires at least Electron 9

Electron versions below 9 are way past their support time by now. Please update to a supported version.

## Check your bot type in the {@ChatClient} instantiation

{@ChatClient} now applies rate limiting by default.
If your bot is a know or verified bot, it may now use way lower rate limits than it could theoretically use.

Please investigate the properties {@ChatClientOptions#botLevel} and {@ChatClientOptions#isAlwaysMod}
to raise them appropriately to your bot status.

## Remove our typos

See, we all make mistakes sometimes. But we fixed them and we ask you to fix them too (otherwise your code will break).

```ts diff -2 +3
declare const reward: HelixCustomReward;
console.log(reward.propmt);
console.log(reward.prompt);
```

## [TypeScript] Check your `callApi` calls

From now on, `callApi` returns `unknown` by default, rather than `any`. This may lead to a lot of compiler errors.

Please specify your return types properly in order to fix them.

Alternatively, you may silence the errors (hopefully temporarily!) by passing `any` as type parameter explicitly.

```ts diff -1 +2
const data = await api.callApi({ url: 'users' });
const data = await api.callApi<any>({ url: 'users' });
```

## Update your own {@AuthProvider} implementation

If you built your own auth provider, its interface now *requires* setting the `tokenType` property
to one of the strings `user` or `app` depending on which type of OAuth token it yields.
You probably want this to be `user`. 
