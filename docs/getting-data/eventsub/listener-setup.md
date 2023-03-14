:::warning{title="Authentication"}

This section assumes that you have prepared [authentication](/docs/auth/).

:::

## Setting up an HTTP EventSub listener

A prerequisite of EventSub over HTTP is a working {@link ApiClient} instance using an app token.
With that, you can create an {@link EventSubHttpListener} instance,
which (in a basic setup without a reverse proxy) requires a trusted SSL certificate for the host name you provide.

You also need to provide a random secret which all event payloads will be signed with.  
It should be randomly generated, but **kept between server restarts**,
so subscriptions can be safely resumed without interruption.

At last, you call the `.start()` method on the listener,
which will start the listener in order to receive events from Twitch.

```ts twoslash
// @module: esnext
// @target: ES2017
import { AppTokenAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { DirectConnectionAdapter, EventSubHttpListener } from '@twurple/eventsub-http';

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';

const authProvider = new AppTokenAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

const adapter = new DirectConnectionAdapter({
	hostName: 'example.com',
	sslCert: {
		key: 'aaaaaaaaaaaaaaa',
		cert: 'bbbbbbbbbbbbbbb'
	}
});
const secret = 'thisShouldBeARandomlyGeneratedFixedString';
const listener = new EventSubHttpListener({ apiClient, adapter, secret });
listener.start();
```

Please note that the server needs to be **available from the outside**.
If you are testing locally, you may need to forward the port to your development machine.  
A very helpful tool for that is [ngrok](/docs/getting-data/eventsub/ngrok) -
this even spares you from creating your own certificate in development!

## Setting up a WebSocket EventSub listener

You can also use EventSub over WebSockets. This is easier to set up especially in development,
and the only way to use EventSub on the client side (at the time of writing), but doesn't scale as well for many users,
as authenticated topics are limited to one user. Instead of an app token, you have to use a user token
(for example using the {@link RefreshingAuthProvider}).

The setup is similar to HTTP, except you don't need an adapter nor a secret,
and you create a {@link EventSubWsListener} instead.

For ease of demonstration, the following example uses a static token, but you should investigate
[the other auth providers](/docs/auth/).

```ts twoslash
// @module: esnext
// @target: ES2017
import { StaticAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { EventSubWsListener } from '@twurple/eventsub-ws';

const clientId = 'YOUR_CLIENT_ID';
const accessToken = 'YOUR_ACCESS_TOKEN';

const authProvider = new StaticAuthProvider(clientId, accessToken);
const apiClient = new ApiClient({ authProvider });

const listener = new EventSubWsListener({ apiClient });
listener.start();
```

## Subscribing to (and unsubscribing from) events

When your listener is set up, you can subscribe to all supported events using this listener:

```ts twoslash
// @module: esnext
// @target: ES2017
// @lib: es2015,dom
import { EventSubListener } from '@twurple/eventsub-base';
declare const listener: EventSubListener;
// ---cut---
const userId = 'YOUR_USER_ID';

const onlineSubscription = listener.onStreamOnline(userId, e => {
	console.log(`${e.broadcasterDisplayName} just went live!`);
});

const offlineSubscription = listener.onStreamOffline(userId, e => {
	console.log(`${e.broadcasterDisplayName} just went offline`);
});
```

The subscription will then automatically start.

When you don't want to listen to a particular event anymore, you just stop its subscription:

```ts
onlineSubscription.stop();
```

To start it back up after stopping, you can use:

```ts
onlineSubscription.start();
```

Note that you don't need to call `.start()` after creating the subscription.
It's only used for subscriptions that you previously stopped manually.

## Testing events

If using the HTTP listener, you can use the Twitch CLI to test your subscriptions,
but you need to take care about some implementation details of this library:  
- At the end of each callback, each event has a unique identifier that is generally built by joining the event name and the other parameters (like the user ID) of the event.
- This user ID is also prepended to the secret you passed to generate a unique secret for each callback. After this, if the resulting string is longer than 100 characters, the last 100 characters will be taken as the secret.

The easiest way to get the proper test command is by using the method {@link EventSubSubscription#getCliTestCommand}}:

```ts twoslash
// @module: esnext
// @target: ES2017
// @lib: es2015,dom
import { EventSubSubscription } from '@twurple/eventsub-http';
declare const onlineSubscription: EventSubSubscription;
// ---cut---
console.log(await onlineSubscription.getCliTestCommand());
// outputs something like:
// twitch event trigger streamup -F https://example.com/event/stream.online.125328655 -s stream.online.125328655.supersecret
```
