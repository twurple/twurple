:::warning{title="Authentication"}

This section assumes that you have prepared [authentication](/docs/auth/) with a **user token**.

:::

You create a {@ChatClient} instance by passing an authentication provider to it. It should be linked to the bot user you intend to use.

You can also pass a list of channels to join after finalizing the connection.

Channel names are case insensitive and can optinally start with a `#`. The name will be converted to the correct format internally.

A full list of connection options can be found in the {@ChatClient} class reference.

Then, using the instance, you can listen to events and connect to the Twitch Chat server.

```ts twoslash
// @module: esnext
// @target: ES2017
// @lib: es2015,dom
import type { AuthProvider } from '@twurple/auth';

declare const authProvider: AuthProvider;
// ---cut---
import { ChatClient } from '@twurple/chat';

const chatClient = new ChatClient({ authProvider, channels: ['lidlrini'] });
await chatClient.connect();
```
