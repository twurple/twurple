:::warning{title="Authentication"}

This section assumes that you have prepared [authentication](/docs/auth/).

:::

Creating an API client is fairly straightforward, you just need to pass your authentication provider:

```ts twoslash
// @module: esnext
// @target: ES2017
// @lib: es2015,dom
import type { AuthProvider } from '@twurple/auth';

declare const authProvider: AuthProvider;
// ---cut---
import { ApiClient } from '@twurple/api';

const apiClient = new ApiClient({ authProvider });
```

On the {@link ApiClient} instance, the API methods are namespaced into the different resources like `users` and `streams`.

All API methods are `async` and thus must be `await`ed. Here's a quick example:

```ts
async function isSubscribedTo(userName: string, broadcasterName: string) {
	const user = await apiClient.users.getUserByName(userName);
	if (!user) {
		return false;
	}
	const broadcaster = await apiClient.users.getUserByName(broadcasterName);
	if (!broadcaster) {
		return false;
	}
	const subscription = await apiClient.subscriptions.getSubscriptionForUser(broadcaster, user);
	
	return subscription !== null;
}
```

We make extensive use of shortcut methods that fetch related resources, so this can also be written a bit easier:

```ts
async function isSubscribedTo(userName: string, broadcasterName: string) {
	const user = await apiClient.users.getUserByName(userName);
	if (!user) {
		return false;
	}
	const broadcaster = await apiClient.users.getUserByName(broadcasterName);
	if (!broadcaster) {
		return false;
	}
	return await user.isSubscribedTo(broadcaster);
}
```

In Helix, some resources are paginated using a cursor. To faciliate easy pagination, there are special methods suffixed with `Paginated` that wrap the result in a {@link HelixPaginatedRequest} object. There are multiple ways to use this object to get your results.

- Using `getNext()`:

```ts
async function getAllClipsForBroadcaster(userId: string) {
	const request = apiClient.clips.getClipsForBroadcasterPaginated(userId);
	let page: HelixClip[];
	const result: HelixClip[] = [];

	while ((page = await request.getNext()).length) {
		result.push(...page);
	}

	return result;
}
```

- Using `getAll()`:

```ts
async function getAllClipsForBroadcaster(userId: string) {
	const request = apiClient.clips.getClipsForBroadcasterPaginated(userId);

	return request.getAll();
}
```

- Using a [`for await ... of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) loop:

```ts
async function findClipFromBroadcasterWithTitle(userId: string, searchTerm: string) {
	for await (const clip of apiClient.clips.getClipsForBroadcasterPaginated(userId)) {
		if (clip.title.includes(searchTerm)) {
			return clip;
		}
	}

	return null;
}
```

**WARNING:** Uncontrolled use of the paginator may lead to quick exhaustion of your rate limit with big, unfiltered result sets. Please use filters and exit your loops as soon as you have enough data.
