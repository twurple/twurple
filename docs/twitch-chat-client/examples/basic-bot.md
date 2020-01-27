In this example, you learn how to set up a basic bot that reacts to a few commands, and also automatically thanks everyone that subscribes, resubscribes or gifts a subscription.

We will achieve authorization by fetching an initial access token from Twitch and then refreshing that token using the refreh token provided by the same request.

If you already have an authentication flow up and running with a `TwitchClient` instance, you find all you need in step 4 and 5.

## 1. Create a Twitch application

Go to your [Twitch developer console](https://dev.twitch.tv/console/apps) and create a new application. If you don't know what a Redirect URI is, use `http://localhost`. Write down Client ID and Client Secret somewhere - you're gonna need them!

## 2. Obtain an access token from Twitch

Visit this site, with the CLIENT_ID and REDIRECT_URI placeholders replaced with your client ID and redirect URI, respectively:

```
https://id.twitch.tv/oauth2/authorize?client_id=CLIENT_ID
	&redirect_uri=REDIRECT_URI
	&response_type=code
	&scope=chat:read+chat:edit
```

Log in with the account you want to use for your bot and confirm the access to Twitch. You should get redirected to your redirect URI with a query parameter named `code`.

Using a tool like [Insomnia](https://insomnia.rest/) or [Postman](https://www.getpostman.com/), make a `POST` request to this URL, again, with all placeholders replaced:

```
https://id.twitch.tv/oauth2/token?client_id=CLIENT_ID
    &client_secret=CLIENT_SECRET
    &code=CODE_FROM_LAST_REQUEST
    &grant_type=authorization_code
    &redirect_uri=REDIRECT_URI
```

The response body should look similar to the following:

```javascript
{
  "access_token": "0123456789abcdefghijABCDEFGHIJ",
  "refresh_token": "eyJfaWQmNzMtNGCJ9%6VFV5LNrZFUj8oU231/3Aj",
  "expires_in": 3600,
  "scope": ["chat:read", "chat:edit"],
  "token_type": "bearer"
}
```

Write down the `access_token` and `refresh_token` properties of the response body. These are important for all the other requests you're sending to Twitch!

## 3. Create a `TwitchClient` instance

Now you can finally start writing code! First, import all the classes you're gonna need from `twitch` and `twitch-chat-client`.

```typescript
import TwitchClient from 'twitch';
import ChatClient from 'twitch-chat-client';
```

Now, as long as [top-level await](https://github.com/tc39/proposal-top-level-await) has not landed in popular runtimes, you need to work around that by placing your main routine inside an immediately executed inline function expression.

```typescript
(async () => {
	// code goes here
})();
```

All the following code needs to be inside this function (or at least called from inside it) so we can use `await` and still avoid race conditions.

Now, we can construct a `TwitchClient` instance:

```typescript
const clientId = 'uo6dggojyb8d6soh92zknwmi5ej1q2';
const accessToken = '0123456789abcdefghijABCDEFGHIJ';
const twitchClient = await TwitchClient.withCredentials(clientId, accessToken);
```

## 4. Connect to chat

Using the `TwitchClient` instance we just created, we can easily create a `ChatClient` instance.

```typescript
const chatClient = await ChatClient.forTwitchClient(twitchClient);
```

Now, you can connect to the chat server, and after the connection and login process has finished, join your channel.

```typescript
await chatClient.connect();
chatClient.onRegister(() => chatClient.join('satisfiedpear'));
```

You can join multiple channels - all you have to do is repeat that last line with another channel name.

Now you can run your code and see your bot sitting in your channel. But we want it to do something!

## 5. Listen and react to events

Fortunately, reacting to things is easy. To listen to chat messages, just use the `onPrivmsg` method. As an example, we implement a few basic commands here:

```typescript
chatClient.onPrivmsg((channel, user, message) => {
	if (message === '!ping') {
		chatClient.say(channel, 'Pong!');
	} else if (message === '!dice') {
		const diceRoll = Math.floor(Math.random() * 6) + 1;
		chatClient.say(channel, `@${user} rolled a ${diceRoll}`)
	}
});
```

Handling subscriptions is also pretty easy.

```typescript
chatClient.onSub((channel, user) => {
	chatClient.say(channel, `Thanks to @${user} for subscribing to the channel!`);
});

chatClient.onResub((channel, user, subInfo) => {
	chatClient.say(channel, `Thanks to @${user} for subscribing to the channel for a total of ${subInfo.months} months!`);
});

chatClient.onSubGift((channel, user, subInfo) => {
	chatClient.say(channel, `Thanks to ${subInfo.gifter} for gifting a subscription to ${user}!`);
});
```

Now you have a working bot! Until you have to restart it a few hours later...

## 6. Setting up automatic token refreshing

Fortunately, with the access token in step 2, we also got a refresh token! (You wrote that down, didn't you?)

You can pass that to the `TwitchClient` factory method to create a client that automatically refreshes the given token.

Just replace the initialization line with this (but keep the `clientId` and `accessToken` constants):

```typescript
const clientSecret = 'nyo51xcdrerl8z9m56w9w6wg';
const refreshToken = 'eyJfaWQmNzMtNGCJ9%6VFV5LNrZFUj8oU231/3Aj';

const twitchClient = TwitchClient.withCredentials(clientId, accessToken, undefined, {
	clientSecret,
	refreshToken
});
```

## 7. Persisting the refreshed token data

The last problem we have is restarting the bot. When it crashes for any reason, the refreshed token is gone and the application will try using the old token again, which probably fails.

The `refreshConfig` parameter we just added can contain another property named `onRefresh`. Using this, you can persist tokens as soon as they're refreshed.

To prepare for this, let's move the tokens to a JSON file named `tokens.json`:

```javascript
{
	"accessToken": "0123456789abcdefghijABCDEFGHIJ",
	"refreshToken": "eyJfaWQmNzMtNGCJ9%6VFV5LNrZFUj8oU231/3Aj",
	"expiryTimestamp": 0
}
```

I also added a new property called `expiryTimestamp`. It will save the expiry time of the access token so the client can determine when to refresh the token without making a failing call first. If you didn't calculate the expiry timestamp after sending the manual code request (you probably didn't - I wouldn't either), you can initialize it to zero to always make a refresh call in the beginning.

Now, we can parse this JSON file on startup, load the tokens from it and when the tokens refresh, save them back into the same file. For the file I/O, I prefer to use the `fs-extra` package because it provides a promisified interface to the filesystem, unlike the `fs` package shipped with Node, which still uses callbacks.

```typescript
// add to import block before async function
import * as fs from 'fs-extra';

// inside the async function again
const tokenData = JSON.parse(await fs.readFile('./tokens.json'));
const twitchClient = await TwitchClient.withCredentials(clientId, tokenData.accessToken, undefined, {
        clientSecret,
        refreshToken: tokenData.refreshToken,
        expiry: tokenData.expiryTimestamp === null ? null : new Date(tokenData.expiryTimestamp),
        onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
            const newTokenData = {
                accessToken,
                refreshToken,
                expiryTimestamp: expiryDate === null ? null : expiryDate.getTime()
            };
            await fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
        }
    });
```

## 8. ???

We're done! Your bot should now connect to chat and react to a few basic commands as well as subs, resubs and gift subs. It is able to recover gracefully when crashing.

## 9. Profit!

Now you can implement a more elaborated command system, add more events to react to, and much more! All events are documented in the {@ChatClient} class. And don't forget to have fun!

For reference, here's the full code that _should_ be the result of everything we just did:

```typescript
import TwitchClient from 'twitch';
import ChatClient from 'twitch-chat-client';
import * as fs from 'fs-extra';

(async () => {
    const clientId = 'uo6dggojyb8d6soh92zknwmi5ej1q2';
    const clientSecret = 'nyo51xcdrerl8z9m56w9w6wg';
    const tokenData = JSON.parse(await fs.readFile('./tokens.json', 'UTF-8'));
    const twitchClient = await TwitchClient.withCredentials(clientId, tokenData.accessToken, undefined, {
        clientSecret,
        refreshToken: tokenData.refreshToken,
        expiry: tokenData.expiryTimestamp === null ? null : new Date(tokenData.expiryTimestamp),
        onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
            const newTokenData = {
                accessToken,
                refreshToken,
                expiryTimestamp: expiryDate === null ? null : expiryDate.getTime()
            };
            await fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
        }
    });

    const chatClient = await ChatClient.forTwitchClient(twitchClient);

    await chatClient.connect();
    chatClient.onRegister(() => chatClient.join('satisfiedpear'));

    chatClient.onPrivmsg((channel, user, message) => {
        if (message === '!ping') {
            chatClient.say(channel, 'Pong!');
        } else if (message === '!dice') {
            const diceRoll = Math.floor(Math.random() * 6) + 1;
            chatClient.say(channel, `@${user} rolled a ${diceRoll}`)
        }
    });

    chatClient.onSub((channel, user) => {
        chatClient.say(channel, `Thanks to @${user} for subscribing to the channel!`);
    });
    chatClient.onResub((channel, user, subInfo) => {
        chatClient.say(channel, `Thanks to @${user} for subscribing to the channel for a total of ${subInfo.months} months!`);
    });
    chatClient.onSubGift((channel, user, subInfo) => {
        chatClient.say(channel, `Thanks to ${subInfo.gifter} for gifting a subscription to ${user}!`);
    });
})();
```
