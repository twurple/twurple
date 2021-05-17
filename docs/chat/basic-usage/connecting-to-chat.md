First, you have to create an auth provider instance, as outlined in [the Twurple API client documentation](/docs/api/basic-usage/creating-instance).

Then, using that instance, you create a new {@ChatClient} instance, listen to events and connect it to the Twitch Chat server.

Channel names are case insensitive and can start with a `#` or not. The name will be converted to the correct format internally.

```typescript
import { ChatClient } from '@twurple/chat';

const chatClient = new ChatClient(authProvider, { channels: ['lidlrini'] });
// listen to more events...
await chatClient.connect();
```

**Please note** that you should use `onRegister` to do things after the registration with the chat server finishes. This documentation previously recommended using the method `waitForRegistration` which is fine at first but will not rejoin channels (or redo whatever else you do after connecting) when a reconnect occurs.
