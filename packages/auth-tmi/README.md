# ⚠ WARNING

This is a future version still in development. For a stable version, check out [the `twitch-auth-tmi` package](https://www.npmjs.com/package/twitch-auth-tmi).

# Twurple - Authentication for TMI.js

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/twurple/twurple/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/@twurple/auth-tmi.svg?style=flat)](https://www.npmjs.com/package/@twurple/auth-tmi)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

Use tmi.js with the added benefits of `@twurple/auth`'s automatic token handling.

## Installation

	yarn add @twurple/auth @twurple/auth-tmi

or using npm:

	npm install @twurple/auth @twurple/auth-tmi

## How to use

This package is generally used like `tmi.js` is normally, with just a single minor change.

It completely ignores the `identity` option, and instead takes an `authProvider` option which takes an
[`AuthProvider`](https://twurple.js.org/reference/auth/interfaces/AuthProvider.html)
instance that can be used for other `@twurple` packages as well.

This also offers the additional benefit of being able to refresh tokens internally using
[a refreshing AuthProvider](https://twurple.js.org/docs/auth/providers/refreshing.html).

### Example

Taken from the [tmi.js README](https://www.npmjs.com/package/tmi.js) and adapted for this package:

```js
const tmi = require('@twurple/auth-tmi');
const { StaticAuthProvider } = require('@twurple/auth');
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
