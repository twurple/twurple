The API methods are organized into the different API subresources, like `/users` and `/streams`. All the API methods are `async` and thus can be `await`ed. Here's a quick example:

```typescript
async function isStreamLive(userName: string) {
	const user = await twitchClient.users.getUserByName(userName);
	if (!user) {
		return false;
	}
	return await twitchClient.streams.getStreamByChannel(user.id) !== null;
}
```

We make extensive use of convenience methods that fetch related resources, so this can also be written a bit easier:

```typescript
async function isStreamLive(userName: string) {
	const user = await twitchClient.users.getUserByName(userName);
	if (!user) {
		return false;
	}
	return await user.getStream() !== null;
}
```
