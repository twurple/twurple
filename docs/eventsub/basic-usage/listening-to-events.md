First, you have to create an instance of any authentication provider.
EventSub can only work with app credentials.

Then, you create a new {@ApiClient}, and using that, an {@EventSubListener} instance,
which requires a working SSL certificate for the host name you provide.

You also need to provide a random secret which all event payloads will be signed with.  
It should be randomly generated, but kept between server restarts,
so subscriptions can be safely resumed without interruption.

At last, you call the `.listen()` method on the listener,
which will start the listener in order to receive events from Twitch.

```ts twoslash
// @module: esnext
// @target: ES2017
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { DirectConnectionAdapter, EventSubListener } from '@twurple/eventsub';

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

const listener = new EventSubListener(apiClient, new DirectConnectionAdapter({
	hostName: 'example.com',
	sslCert: {
		key: 'aaaaaaaaaaaaaaa',
		cert: 'bbbbbbbbbbbbbbb'
	}
}), 'thisShouldBeARandomlyGeneratedFixedString');
await listener.listen();
```

You may pass a nonstandard port to it like `listener.listen(8443)`,
but keep in mind that the SSL certificate needs to reflect that.

Please note that the port you supply needs to be **available from the outside**.
If you are testing locally, you may need to forward the port to your development machine.  
A very helpful tool for that is [ngrok](/docs/eventsub/special-hosting/ngrok) -
this even spares you from creating your own certificate in development!

When your listener is set up, you can subscribe to all supported events using this listener:

```ts twoslash
// @module: esnext
// @target: ES2017
// @lib: es2015,dom
import { EventSubListener } from '@twurple/eventsub';
declare const listener: EventSubListener
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
