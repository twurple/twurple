Intents enable you to give responsibilities to your different authenticated users. For example,
you can assign one user to be a chatbot that will then be used to connect to chat and represent your application there. 

:::warning

At the moment, only the {@link RefreshingAuthProvider} implements this concept.

You can also include it in your own {@link AuthProvider} implementation.

:::

Assignment of intents to a user can be done when adding a user to the provider, using the second parameter:

```ts
await authProvider.addUserForToken(tokenData, ['chat']);
```

This will add the `chat` intent to that user, assigning it to be used by {@link ChatClient} by default.
(The used intents can be configured in its options.)

Alternatively, you can add intents to users after the fact as well:

```ts
authProvider.addIntentsToUser('125328655', ['chat']);
```

## Advanced usage: Fallback

Suppose you are running a big chatbot that runs under the same username for everyone.

Now you want to add some premium features for paying users: they run in their own process,
and they can optionally link their own bot account that your bot will run as.

With intents, this is nearly trivial. First, register your regular chatbot with the `chat` intent as described above.

Then, if the streamer opts to use the custom bot feature,
just assign the custom bot account to an intent including the streamer's ID:

```ts
await authProvider.addUserForToken(customBotTokenData, [`chatBotFor:${streamerUserId}`]);
```

Now, for each of your "premium user" processes, you can configure {@link ChatClient}
to make it use the intent you just configured.

```ts
const chat = new ChatClient({
	// ... more options ...
	authIntents: [`chatBotFor:${streamerUserId}`]
});
```

This will make the bot run on the custom account if it's configured.
If there is no custom account, it will fall back to using the regular account with the `chat` intent.
