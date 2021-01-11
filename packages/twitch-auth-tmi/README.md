# Twitch.js - Authentication for TMI.js

Use tmi.js with the added benefits of twitch-auth's automatic token handling.

## Installation

	yarn add twitch-auth-tmi

or using npm:

	npm install --save twitch-auth-tmi

## How to use

This package is generally used like `tmi.js` is normally, with just a single minor change.

It completely ignores the `identity` option, and instead takes an `authProvider` option which takes an
[`AuthProvider`](https://d-fischer.github.io/twitch-auth/reference/interfaces/AuthProvider.html)
instance that can be used for other `twitch` packages as well.

This also offers the additional benefit of being able to refresh tokens internally using
[a refreshable AuthProvider](https://d-fischer.github.io/twitch-auth/docs/providers/refreshable.html).

### Example

Taken from the [tmi.js README](https://www.npmjs.com/package/tmi.js) and adapted for this package:

```js
const tmi = require('twitch-auth-tmi');
const { StaticAuthProvider } = require('twitch-auth');
const authProvider = new StaticAuthProvider('my-client-id', 'my-bot-token');
const client = new tmi.Client({
	options: { debug: true, messagesLogLevel: 'info' },
	connection: {
		reconnect: true,
		secure: true
	},
	authProvider: authProvider,
	channels: ['my-channel']
});
client.connect().catch(console.error);
client.on('message', (channel, tags, message, self) => {
	if (self) return;
	if (message.toLowerCase() === '!hello') {
		client.say(channel, `@${tags.username}, heya!`);
	}
});
```

## If you're getting stuck...

You can join the [Discord server](https://discord.gg/b9ZqMfz) for support.
