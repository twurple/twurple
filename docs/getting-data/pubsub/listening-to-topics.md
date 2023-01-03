:::warning{title="Authentication"}

This section assumes that you have prepared [authentication](/docs/auth/) with a **user token**.

:::

Creating a {@link PubSubClient} instance works like all the other clients do; just pass an {@link AuthProvider} instance:

```ts twoslash
// @module: esnext
// @target: ES2017
// @lib: es2015,dom
import type { AuthProvider } from '@twurple/auth';
declare const authProvider: AuthProvider;
// ---cut---
import { PubSubClient } from '@twurple/pubsub';

const pubSubClient = new PubSubClient({ authProvider });
```

It's very easy to listen to events for any authenticated user now:

```ts twoslash
// @module: esnext
// @target: ES2017
// @lib: es2015,dom
import type { PubSubClient } from '@twurple/pubsub';
declare const pubSubClient: PubSubClient;
declare const userId: string;
// ---cut---
import { PubSubSubscriptionMessage } from '@twurple/pubsub';

const handler = pubSubClient.onSubscription(userId, (message: PubSubSubscriptionMessage) => {
	console.log(`${message.userDisplayName} just subscribed!`);
});
```

When you don't want to listen to an event anymore, you just remove the handler:

```ts twoslash
import type { PubSubHandler } from '@twurple/pubsub';
declare const handler: PubSubHandler;
// ---cut---
handler.remove();
```
