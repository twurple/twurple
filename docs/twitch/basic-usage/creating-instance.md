The first thing you do is creating a Twitch client instance. The easiest way to get one is to supply static credentials:

```typescript
import TwitchClient from 'twitch';

const clientId = '123abc';
const accessToken = 'def456';
const twitchClient = TwitchClient.withCredentials(clientId, accessToken);
```

You can also have the client refresh the tokens automatically if necessary by supplying the `refreshConfig` parameter containing the necessary data:

```typescript
import TwitchClient, {AccessToken} from 'twitch';

const clientId = '123abc';
const accessToken = 'def456';
const clientSecret = 'foobar';
const refreshToken = '999999';
const twitchClient = TwitchClient.withCredentials(clientId, accessToken, undefined, {clientSecret, refreshToken, onRefresh: (token: AccessToken) => {
	// do things with the new token data, e.g. save them in your database
}});
```

There's a more elaborated example on how to make auto refreshing work in the [twitch-chat-client documentation](/twitch-chat-client/docs/examples/basic-bot.html).

If you don't need any client scopes, you may also create the client using client credentials:

```typescript
import TwitchClient from 'twitch';

const clientId = '123abc';
const clientSecret = 'foobar';
const twitchClient = TwitchClient.withClientCredentials(clientId, clientSecret);
```

The following sections assume that you have created a `twitchClient` already.
