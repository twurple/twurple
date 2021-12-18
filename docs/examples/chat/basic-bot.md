In this example, you learn how to set up a basic bot that reacts to a few commands, and also automatically thanks everyone that subscribes, resubscribes or gifts a subscription.

We will achieve authorization by fetching an initial access token from Twitch and then refreshing that token using the refreh token provided by the same request.

If you already have an authentication flow up and running with an `AuthProvider` instance, you find all you need in step 4 and 5.

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

```json
{
	"access_token": "0123456789abcdefghijABCDEFGHIJ",
	"refresh_token": "eyJfaWQmNzMtNGCJ9%6VFV5LNrZFUj8oU231/3Aj",
	"expires_in": 3600,
	"scope": ["chat:read", "chat:edit"],
	"token_type": "bearer"
}
```

Write down the `access_token` and `refresh_token` properties of the response body. These are important for all the other requests you're sending to Twitch!

## 3. Create an `AuthProvider` instance

Now you can finally start writing code! First, import all the classes you're gonna need from `@twurple/auth` and `@twurple/chat`.

```ts
import { StaticAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
```

Now, as long as [top-level await](https://github.com/tc39/proposal-top-level-await) has not landed in popular runtimes, you need to work around that by placing your main routine inside an async function and running it.

```ts
async function main() {
	// code goes here
}

main();
```

All the following code needs to be inside this function (or at least called from inside it) so we can use `await` and still avoid race conditions.

Now, we can construct a `StaticAuthProvider` instance using a static auth provider:

```ts
const clientId = 'uo6dggojyb8d6soh92zknwmi5ej1q2';
const accessToken = '0123456789abcdefghijABCDEFGHIJ';
const authProvider = new StaticAuthProvider(clientId, accessToken);
```

## 4. Connect to chat

Using the `AuthProvider` instance we just created, we can easily create a `ChatClient` instance and connect to the chat server.
The given channels will automatically be joined after connecting.

```ts
const chatClient = new ChatClient({ authProvider, channels: ['satisfiedpear'] });
await chatClient.connect();
```

Now you can run your code and see your bot sitting in your channel. But we want it to do something!

## 5. Listen and react to events

Fortunately, reacting to things is easy. To listen to chat messages, just use the `onMessage` method. As an example, we implement a few basic commands here:

```ts
chatClient.onMessage((channel, user, message) => {
	if (message === '!ping') {
		chatClient.say(channel, 'Pong!');
	} else if (message === '!dice') {
		const diceRoll = Math.floor(Math.random() * 6) + 1;
		chatClient.say(channel, `@${user} rolled a ${diceRoll}`)
	}
});
```

Handling subscriptions is also pretty easy.

```ts
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

With that, you can create another type of auth provider that automatically refreshes the given token.

Just replace the initialization line with this (but keep the `clientId` and `accessToken` constants):

```ts
// replace @twurple/auth import line
import { RefreshingAuthProvider } from '@twurple/auth';

const clientSecret = 'nyo51xcdrerl8z9m56w9w6wg';
const refreshToken = 'eyJfaWQmNzMtNGCJ9%6VFV5LNrZFUj8oU231/3Aj';

const authProvider = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret
	},
	{
		accessToken,
		refreshToken
	}
);
```

## 7. Persisting the refreshed token data

The last problem we have is restarting the bot. When it crashes for any reason, the refreshed token is gone and the application will try using the old token again, which probably fails.

The `refreshConfig` parameter we just added can contain another property named `onRefresh`. Using this, you can persist tokens as soon as they're refreshed.

To prepare for this, let's move the tokens to a JSON file named `tokens.json`:

```json
{
	"accessToken": "0123456789abcdefghijABCDEFGHIJ",
	"refreshToken": "eyJfaWQmNzMtNGCJ9%6VFV5LNrZFUj8oU231/3Aj",
	"expiresIn": 0,
	"obtainmentTimestamp": 0
}
```

I also added two new properties called `expiresIn` and `obtainmentTimestamp`. They will save the expiry time of the access token so the client can determine when to refresh the token without making a failing call first. If you didn't get a current timetamp when sending the manual code request (you probably didn't - I wouldn't either), you can initialize them to zero to always make a refresh call in the beginning.

Now, we can parse this JSON file on startup, load the tokens from it and when the tokens refresh, save them back into the same file.

```ts
// add to import block before async function
import { promises as fs } from 'fs';

// inside the async function again
const tokenData = JSON.parse(await fs.readFile('./tokens.json', 'UTF-8'));
const authProvider = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret,
		onRefresh: async newTokenData => await fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
	},
	tokenData
);
```

## 8. ???

We're done! Your bot should now connect to chat and react to a few basic commands as well as subs, resubs and gift subs. It is able to recover gracefully when crashing.

## 9. Profit!

Now you can implement a more elaborated command system, add more events to react to, and much more! All events are documented in the {@ChatClient} class. And don't forget to have fun!

For reference, here's the full code that _should_ be the result of everything we just did:

```ts
import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { promises as fs } from 'fs';

async function main() {
	const clientId = 'uo6dggojyb8d6soh92zknwmi5ej1q2';
	const clientSecret = 'nyo51xcdrerl8z9m56w9w6wg';
	const tokenData = JSON.parse(await fs.readFile('./tokens.json', 'UTF-8'));
	const authProvider = new RefreshingAuthProvider(
		{
			clientId,
			clientSecret,
			onRefresh: async newTokenData => await fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
		},
		tokenData
	);

	const chatClient = new ChatClient({ authProvider, channels: ['satisfiedpear'] });
	await chatClient.connect();

	chatClient.onMessage((channel, user, message) => {
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
}

main();
```
