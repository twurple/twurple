This package is generally used like `tmi.js` is normally, with just a single minor change.

It completely ignores the `identity` option, and instead takes an `authProvider` option which takes an
[`AuthProvider`](/auth/reference/interfaces/AuthProvider)
instance that can be used for other `@twurple` packages as well.

This also offers the additional benefit of being able to refresh tokens internally using
[a refreshable AuthProvider](/auth/docs/providers/refreshable).

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
