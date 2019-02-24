The API methods are namespaced into the different API sections like Kraken and Helix, and below that, into the different subresources like `/users` and `/streams`.

In Kraken, all the API methods are `async` and thus can be `await`ed. Here's a quick example:

```typescript
async function isStreamLive(userName: string) {
	const user = await twitchClient.kraken.users.getUserByName(userName);
	if (!user) {
		return false;
	}
	return await twitchClient.kraken.streams.getStreamByChannel(user.id) !== null;
}
```

We make extensive use of convenience methods that fetch related resources, so this can also be written a bit easier:

```typescript
async function isStreamLive(userName: string) {
	const user = await twitchClient.kraken.users.getUserByName(userName);
	if (!user) {
		return false;
	}
	return await user.getStream() !== null;
}
```

In Helix, some resources are paginated using a cursor. To faciliate easy pagination, the results of these calls are wrapped in a {@HelixPaginatedRequest} object. There are multiple ways to use this object to get your results.

- Using `getNext()`:

```typescript
async function getAllClipsForBroadcaster(userId: string) {
	const request = twitchClient.helix.getClipsForBroadcaster(userId);
	let page: HelixClip[];
	const result: HelixClip[] = [];

	while (page = await request.getNext()) {
		result.push(...page);
	}

	return result;
}
```

- Using `getAll()`:

```typescript
async function getAllClipsForBroadcaster(userId: string) {
	const request = twitchClient.helix.getClipsForBroadcaster(userId);

	return request.getAll();
}
```

- Using a [`for await ... of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) loop:

```typescript
async function findClipFromBroadcasterWithTitle(userId: string, searchTerm: string) {
	for await (const clip of twitchClient.helix.getClipsForBroadcaster(userId)) {
		if (clip.title.includes(searchTerm)) {
			return clip;
		}
	}

	return null;
}
```

**WARNING**: Uncontrolled use of the paginator may lead to quick exhaustion of your rate limit with big, unfiltered result sets. Please use filters and exit your loops as soon as you have enough data.
