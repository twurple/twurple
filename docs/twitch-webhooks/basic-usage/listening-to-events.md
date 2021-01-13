First, you have to create an instance of any authentication provider. This example uses app credentials,
but if you need other types of authentication, check out the [twitch-auth documentation](/twitch-auth).

Then, you create a new {@ApiClient}, and using that, a {@WebHookListener} instance:

```ts twoslash
// @module: esnext
// @target: ES2017
import { ApiClient } from 'twitch';
import { ClientCredentialsAuthProvider } from 'twitch-auth';
import { SimpleAdapter, WebHookListener } from 'twitch-webhooks';

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

const listener = new WebHookListener(apiClient, new SimpleAdapter({
    hostName: 'example.com',
    listenerPort: 8090
}));
await listener.listen();
```

Please note that the port you supply needs to be **available from the outside**.
If you are testing locally, you may need to forward the port to your development machine.
A very helpful tool for that is [ngrok](/twitch-webhooks/docs/special-hosting/ngrok).

When your listener is set up, you can subscribe to all supported events using this listener:

```ts twoslash
// @module: esnext
// @target: ES2017
// @lib: es2015,dom
import { ApiClient } from 'twitch';
import { WebHookListener } from 'twitch-webhooks';
declare const apiClient: ApiClient;
declare const listener: WebHookListener
// ---cut---
const userId = 'YOUR_USER_ID';
// we need to track the previous status of the stream because there are other state changes than the live/offline switch
let prevStream = await apiClient.helix.streams.getStreamByUserId(userId);

const subscription = await listener.subscribeToStreamChanges(userId, async stream => {
    if (stream) {
        if (!prevStream) {
            console.log(`${stream.userDisplayName} just went live with title: ${stream.title}`);
        }
    } else {
        // no stream, no display name
        const user = await apiClient.helix.users.getUserById(userId);
        console.log(`${user!.displayName} just went offline`);
    }
    prevStream = stream ?? null;
});
```

When you don't want to listen to a particular event anymore, you just stop its subscription:

```typescript
await subscription.stop();
```
