:::warning{title="Authentication"}

This section assumes that you have prepared [authentication](/docs/auth/) with an **app token**,
for example using the {@link ClientCredentialsAuthProvider}.

:::

## Setting up an EventSub listener

A prerequisite of EventSub is a working {@link ApiClient} instance.
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
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { DirectConnectionAdapter, EventSubHttpListener } from '@twurple/eventsub-http';

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
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
await listener.start();
```

Please note that the server needs to be **available from the outside**.
If you are testing locally, you may need to forward the port to your development machine.  
A very helpful tool for that is [ngrok](/docs/getting-data/eventsub/ngrok) -
this even spares you from creating your own certificate in development!

## Subscribing to (and unsubscribing from) events

When your listener is set up, you can subscribe to all supported events using this listener:

```ts twoslash
// @module: esnext
// @target: ES2017
// @lib: es2015,dom
import { EventSubHttpListener } from '@twurple/eventsub-http';
declare const listener: EventSubHttpListener;
// ---cut---
const userId = 'YOUR_USER_ID';

const onlineSubscription = await listener.subscribeToStreamOnlineEvents(userId, e => {
	console.log(`${e.broadcasterDisplayName} just went live!`);
});

const offlineSubscription = await listener.subscribeToStreamOfflineEvents(userId, e => {
	console.log(`${e.broadcasterDisplayName} just went offline`);
});
```

When you don't want to listen to a particular event anymore, you just stop its subscription:

```typescript
await onlineSubscription.stop();
```

## Testing events

You can use the Twitch CLI to test your subscriptions,
but you need to take care about some implementation details of this library:  
- At the end of each callback, each event has a unique identifier that is generally built by joining the event name and the other parameters (like the user ID) of the event.
- This user ID is also prepended to the secret you passed to generate an unique secret for each callback. After this, if the resulting string is longer than 100 characters, the last 100 characters will be taken as the secret.

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
