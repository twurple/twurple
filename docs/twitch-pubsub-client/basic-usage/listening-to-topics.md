First, you have to create an instance of the core Twitch client, as outlined in [its own documentation](/twitch/docs/basic-usage/creating-instance.html).

Then, you register that instance with a new {@PubSubClient} instance:

```typescript
import PubSubClient from 'twitch-pubsub-client';

const pubSubClient = new PubSubClient();
await pubSubClient.registerUserListener(twitchClient);
```

It's very easy to listen to events in any channel a core client is registered for now:

```typescript
import { PubSubSubscriptionMessage } from 'twitch-pubsub-client';

const listener = await pubSubClient.onSubscription(userId, (message: PubSubSubscriptionMessage) => {
	console.log(`${message.userDisplayName} just subscribed!`);
});
```

When you don't want to listen to these events anymore, you just remove the listener:

```typescript
listener.remove();
```
