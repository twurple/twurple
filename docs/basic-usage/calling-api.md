The API methods are organized into the different API subresources, like `/users` and `/streams`. All the API methods are `async` and thus can be `await`ed. Here's a quick example:

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
