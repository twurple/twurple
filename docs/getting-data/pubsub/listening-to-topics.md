:::warning{title="Authentication"}

This section assumes that you have prepared [authentication](/docs/auth/) with a **user token**.

:::

Creating a {@PubSubClient} instance is slightly different from other systems, as you don't pass an auth provider to the constructor.

Instead, you can register multiple auth providers for different users after construction:

```ts twoslash
// @module: esnext
// @target: ES2017
// @lib: es2015,dom
import type { AuthProvider } from '@twurple/auth';
declare const authProvider: AuthProvider;
// ---cut---
import { PubSubClient } from '@twurple/pubsub';

const pubSubClient = new PubSubClient();
const userId = await pubSubClient.registerUserListener(authProvider);
```

It's very easy to listen to events for any registered user now:

```ts twoslash
// @module: esnext
// @target: ES2017
// @lib: es2015,dom
import type { PubSubClient } from '@twurple/pubsub';
declare const pubSubClient: PubSubClient;
declare const userId: string;
// ---cut---
import { PubSubSubscriptionMessage } from '@twurple/pubsub';

const listener = await pubSubClient.onSubscription(userId, (message: PubSubSubscriptionMessage) => {
	console.log(`${message.userDisplayName} just subscribed!`);
});
```

When you don't want to listen to an event anymore, you just remove the listener:

```ts twoslash
import type { PubSubListener } from '@twurple/pubsub';
declare const listener: PubSubListener;
// ---cut---
listener.remove();
```
