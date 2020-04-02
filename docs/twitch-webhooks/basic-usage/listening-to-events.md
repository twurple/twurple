First, you have to create an instance of the core Twitch client, as outlined in [its own documentation](/twitch/docs/basic-usage/creating-instance).

Then, you create a new {@WebHookListener} instance using the core client:

```typescript
import WebHookListener from 'twitch-webhooks';

const listener = await WebHookListener.create(twitchClient, {port: 8090});
listener.listen();
```

Please note that the port you supply needs to be **available from the outside**.
If you are testing locally, you may need to forward the port to your development machine.
A very helpful tool for that is [ngrok](/twitch-webhooks/docs/special-hosting/ngrok).

When your listener is set up, you can subscribe to all supported events using this listener:

```typescript
import { HelixStream } from 'twitch';

const subscription = await listener.subscribeToStreamChanges(userId, async (stream?: HelixStream) => {
	if (stream) {
		console.log(`${stream.userDisplayName} just went live with title: ${stream.title}`);
	} else {
		// no stream, no display name
		const user = await twitchClient.helix.users.getUserById(userId);
		console.log(`${user.displayName} just went offline`);
	}
});
```

When you don't want to listen to a particular event anymore, you just stop its subscription:

```typescript
subscription.stop();
```
