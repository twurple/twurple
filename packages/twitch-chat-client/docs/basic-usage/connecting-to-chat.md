First, you have to create an instance of the core Twitch client, as outlined in [its own documentation](https://d-fischer.github.io/twitch/docs/basic-usage/creating-instance.html).

Then, using that instance, you create a new {@ChatClient} instance and connect it to the Twitch Chat server:

```typescript
import ChatClient from 'twitch-chat-client';

const chatClient = await ChatClient.forTwitchClient(twitchClient);
await chatClient.connect();
await chatClient.waitForRegistration();
```

After that, you can join channels. You don't have to care about them being lower case or having a `#` in front of them, as the library does that for you:

```typescript
const userName = 'RiniGrandViper';
await chatClient.join(userName);
```
