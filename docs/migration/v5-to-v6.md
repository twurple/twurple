## Make sure your Node version is new enough

We don't test on Node versions below 16 anymore, so make sure you are running a supported Node version.

## Replace the `@twurple/eventsub` package with `@twurple/eventsub-http`

There have mostly just been naming changes here. Replace the package and update your imports.

A few classes and interfaces now additionally have `Http` in their names:

| Old                                 | New                                     |
|-------------------------------------|-----------------------------------------|
| `EventSubListener`                  | `EventSubHttpListener`                  |
| `EventSubBaseConfig`                | `EventSubHttpBaseConfig`                |
| `EventSubListenerCertificateConfig` | `EventSubHttpListenerCertificateConfig` |
| `EventSubListenerConfig`            | `EventSubHttpListenerConfig`            |

Additionally, please use `.start()` instead of `.listen()` and `.stop()` instead of `.unlisten()`.
The respective deprecated counterparts have been removed.

## Update all packages to the same version

Make sure that all Twurple packages are up-to-date and on the same version.

On a unix-like system with the `jq` utility installed, you can use this handy one-liner for that:

	jq -r '.dependencies | keys[] | select(. | startswith("@twurple/"))' package.json | xargs yarn add

## Update any `AuthProvider` usage

The `AuthProvider` interface and its implementations have been completely reworked.
Now, instead of creating an `AuthProvider` and `ApiClient` for each of your users and your app separately,
you can manage all your users using just one of each.

### {@link RefreshingAuthProvider}

You can just use the `addUser` method to add your users to the provider.
It will also take care of app tokens using the supplied client ID and secret.

```ts diff -5,8 +6,11
const authProvider = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret,
		onRefresh: async (newTokenData) => await fs.writeFile(`./tokens.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8'),
		onRefresh: async (userId, newTokenData) => await fs.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8'),
	},
	tokenData,
);

authProvider.addUser('125328655', tokenData);
```

### {@link AppTokenAuthProvider}

The `ClientCredentialsAuthProvider` has been renamed to `AppTokenAuthProvider` to reflect its outcome better.
Anything using it will, as before, only support calling APIs using app tokens, not representing any user.

### {@link StaticAuthProvider}

There have been no changes, as a static token can only represent one user.

### {@link ChatClient}

In your chat clients, the account to connect with is determined using the `chat` intent by default.
The required intent can be configured using the `authIntents` option.

Now you might be asking, what are intents?

### Intents

You can set intents on every user in an auth provider.
A user can have more than one intent, but an intent can only be used for one user.

To use them with the {@link RefreshingAuthProvider}, just add another parameter to `addUser`:

```ts
authProvider.addUser('125328655', tokenData, ['chat']);
```

You can also add intents to a user after the fact:

```ts
authProvider.addIntentsToUser('125328655', ['chat']);
```

### Custom {@link AuthProvider} implementations

If you wrote your own provider, please refer to the {@link AuthProvider} reference page to reimplement it from scratch.
There is no straightforward migration strategy here.

## Rename subscription methods in EventSub packages

In the `eventsub-http` and `eventsub-ws` packages, the naming convention for the subscription methods has been changed.

Now, instead of starting with `subscribeTo` and ending in `Events`,
the subscription methods start with `on` and dropped the suffix.
For example, `subscribeToChannelUpdateEvents` was renamed to `onChannelUpdate`.

The respective API calls are not affected by this change.

## Use synchronous {@link EventSubMiddleware#apply}

Historically, the `apply` method did some async operations.
Now it doesn't anymore, so we got rid of the pretty much useless `async` attribute,
which means that the function does not return a `Promise` anymore.

You may need to adapt your `Promise` based code due to this.

## Listen to more failure events

A lot of the APIs relating to persistent connections (chat, pubsub, eventsub-ws)
or at least pose as if they were (eventsub-http) were updated from a `Promise` based API
to a more event based API. This means that instead of having the promises reject (possibly fatally),
there are now events that report these failures.

| Old rejecting method            | New event                                                |
|---------------------------------|----------------------------------------------------------|
| `EventSubListener#subscribeTo*` | {@link EventSubHttpListener#onSubscriptionCreateFailure} |
| `EventSubSubscription#stop`     | {@link EventSubHttpListener#onSubscriptionDeleteFailure} |
| `PubSubClient#on*`              | {@link PubSubClient#onListenError}                       |

## Configure a port for your EventSub & ngrok development setup

Previously, the {@link NgrokAdapter} would find a port to listen on using the `portfinder` package.
This behavior was removed. Instead, you can configure the port you want now.

If you want the old behavior back, use the `portfinder` package directly.

## Switch from the old badges API

There were two different badges APIs, one of which (`apiClient.badges`) is obsolete now.
Please use the very similar methods within {@link HelixChatApi} instead.

## Switch from the old chatters API

Similarly, there was a chatters API available under the `apiClient.unsupported` namespace.
This was now removed in favor of the new Helix API under {@link HelixChatApi#getChatters}.

## Switch chat actions to the Helix API

All chat actions other than ones relating to sending messages (like banning, changing sub/follower only mode etc.)
were removed by Twitch. You need to switch to the respective Helix APIs instead.

Most of them are in {@link HelixChatApi} or {@link HelixModerationApi}.

## Create bans & clips: update request body

When creating bans & clips, the banned user / the channel to create the clip in could always have been a user ID or a user object,
just like in most places in the library. The parameter names were updated to reflect that.
So instead of giving a `userId` to ban, you now give a `user` (which can still be an ID).
Similarly, replace the `channelId` for the clip with just `channel`.

## Adapt for additional minor renames and removes

There's not that much to say about these (most were just to align more to the documentation or for consistency),
so I'll just list them:

| Old                                            | New                                                      |
|------------------------------------------------|----------------------------------------------------------|
| `PubSubListener`                               | {@link PubSubHandler}                                    |
| `HelixChannelApi#getChannelInfo`               | {@link HelixChannelApi#getChannelInfoById}               |
| `HelixCustomReward#autoApproved`               | {@link HelixCustomReward#autoFulfill}                    |
| `HelixBanUser#broadcasterId`                   | *removed* (you needed this ID for fetching anyway)       |
| `HelixBanUser#endDate`                         | {@link HelixBanUser#expiryDate}                          |
| `HelixUser#views`                              | *removed* (removed by Twitch)                            |
| `PubSubSubscriptionMessage#giftDuration`       | {@link PubSubSubscriptionMessage#duration}               |
| `ApiClient#lastKnown*`                         | {@link ApiClient#rateLimiterStats}                       |
| `EventSubChannelRedemptionAddEvent#redeemedAt` | {@link EventSubChannelRedemptionAddEvent#redemptionDate} |

## Make sure your EventSub HTTP host name configuration is correct (or configure the listener accordingly)

The `strictHostCheck` configuration option now defaults to being on.
This means that requests that go to the wrong host name but still reach the listener
(for example wide-range port scanners) will automatically be filtered.
In some cases, this can filter out legitimate requests, for example with a misconfigured reverse proxy.

While we recommend you to fix your reverse proxy (or any other part of your setup) instead,
you may disable this behavior explicitly by setting `strictHostCheck: false` in the constructor options. 

## Clear your EventSub HTTP subscriptions (or opt to do it a bit later)

In the past, your EventSub secret was augmented with an internal ID for each subscription
in order to create different secrets for different subscriptions.
This is pretty much unnecessary and in some cases may even reduce entropy.

This behavior is now disabled by default, which means you have to delete all subscriptions and re-subscribe to them.

Alternatively, you can set `legacySecrets: true` in the constructor options to postpone this,
but be aware that this flag will go away in the next major release of Twurple.
