In some cases, you may already have an existing Express app and you want to mount an EventSub listener into it.

This is made easy with the {@link EventSubMiddleware} class.

You just need to follow some easy steps to make sure the events come through:

1. Create an instance
2. Run the `.apply(app)` method, passing your Express app as parameter
3. In the listen callback of the app, run (and await) the `.markAsReady()` method

Now you can continue subscribing to your desired EventSub events as usual.

## Example

```ts twoslash
// @module: esnext
// @target: ES2017
// @lib: es2015,dom
import type { ApiClient } from '@twurple/api';
import { EventSubMiddleware } from '@twurple/eventsub-http';
declare const app: any;
declare const apiClient: ApiClient;
// ---cut---
const middleware = new EventSubMiddleware({
  apiClient,
  hostName: 'example.com',
  pathPrefix: '/twitch',
  secret: 'secretHere'
});

middleware.apply(app);
app.listen(3000, async () => {
  await middleware.markAsReady();
  middleware.onChannelFollow('125328655', event => {
    console.log(`${event.userDisplayName} just followed ${event.broadcasterDisplayName}!`);
  });
});
```
