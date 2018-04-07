# Twitch.js
__ATTENTION:__ This library is still under initial development.

Public APIs may break with any release that increases y in version 0.y.z until this library reaches 1.0 (as per [SemVer](http://semver.org/#spec-item-4)).

## Installation

To add Twitch.js to your project, just execute:
	
	yarn add twitch
	
## Basic usage

### Constructing a client instance

The first thing you do is constructing a Twitch client instance. The easiest way to get one is to supply static credentials:

```typescript
import TwitchClient from 'twitch';

const clientId = '123abc';
const accessToken = 'def456';
const twitchClient = TwitchClient.withCredentials(clientId, accessToken);
```

You can also have the client refresh the tokens automatically if necessary by supplying an additional parameter containing the necessary data:

```typescript
import TwitchClient, {AccessToken} from 'twitch';

const clientId = '123abc';
const accessToken = 'def456';
const clientSecret = 'foobar';
const refreshToken = '999999';
const twitchClient = TwitchClient.withCredentials(clientId, accessToken, {clientSecret, refreshToken, onRefresh: (token: AccessToken) => {
	// do things with the new token data, e.g. save them in your database
}});
```

The following sections assume that you have created a `twitchClient` already.

### Calling the Twitch API

The API methods are organized into the different API subresources, like `/users` and `/streams`. All the API methods are `async` and thus can be awaited. Have a quick example:

```typescript
async function isStreamLive(userName: string) {
	try {
		const user = await twitchClient.users.getUserByName(userName);
		await twitchClient.streams.getStreamByChannel(user.id); // will reject the promise if the stream is not live
		return true;
	} catch (e) {
		return false;
	}
}
```

We make extensive use of convenience methods that fetch related resources, so this can also be written a bit easier:

```typescript
async function isStreamLive(userName: string) {
	try {
		const user = await twitchClient.users.getUserByName(userName);
		await user.getStream(); // will reject the promise if the stream is not live
		return true;
	} catch (e) {
		return false;
	}
}
```

### Connecting to Twitch Chat

TODO

### Connecting to PubSub

TODO

## Support
You can join the [Discord Server](https://discord.gg/b9ZqMfz) for support.
